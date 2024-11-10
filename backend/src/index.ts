import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';
import zod from 'zod';

const emailSchema = zod.string().email();
const app = new Hono<{
  Bindings: { 
    DATABASE_URL: string; 
    JWT_STRING: string 
  };
  Variables: { 
    userId: string 
  };
}>();

app.use('*', cors({
  origin: 'https://habit-task-track.netlify.app/',
}));


// Initialize Prisma Client with Accelerate extension
const initializePrisma = (url: string) =>
  new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

// Middleware 
app.use("/user/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  
  try {
    const user = await verify(token, c.env.JWT_STRING);
    c.set("userId", user.id);
    await next();

  } catch {
    return c.json({ 
      message: "You Are Not Logged In" 
    }, 401);
  }
});


app.post('/register', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const detail = await c.req.json();

  const emailValid = emailSchema.safeParse(detail.email);
  if (!emailValid.success || !detail.password || !detail.firstname) {
    return c.json({ 
      message: "Invalid Credentials" 
    }, 400);
  }

  try {
    const existingUser = await prisma.user.findUnique({ 
      where: { 
        email: detail.email 
      } 
    });
    if (existingUser) {
      return c.json({ 
        message: "User Already Exists" 
      }, 400);
    }

    const hashedPassword = await bcrypt.hash(detail.password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstName: detail.firstname,
        lastName: detail.lastname,
        email: detail.email,
        password: hashedPassword
      },
    });

    const token = await sign({ id: newUser.id }, c.env.JWT_STRING);
    
    return c.json({ 
      message: token 
    }, 200);

  } catch (error) {
    console.error("Error during registration:", error);
    return c.json({ 
      message: "Registration Failed" 
    }, 500);
  }
});


app.post('/login', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const { email, password } = await c.req.json();

  const emailValid = emailSchema.safeParse(email);
  if (!emailValid.success) {
    return c.json({ 
      message: "Invalid Email Format" 
    }, 400);
  }

  try {
    const user = await prisma.user.findUnique({ 
      where: { 
        email 
      } 
    });
    
    if (!user) {
      return c.json({ 
        message: "User Does Not Exist" 
      }, 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return c.json({ 
        message: "Invalid Credentials" 
      }, 401);
    }

    const token = await sign({ id: user.id }, c.env.JWT_STRING);
    return c.json({ 
      message: token 
    }, 200);

  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ 
      message: "Login Failed" 
    }, 500);
  }
});


app.get('/user/fetchtodo', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const date = c.req.query('date');
  const userId = c.get("userId");

  try {
    const dateRecord = await prisma.date.findFirst({ 
      where: { 
        userId, date
      } 
    });
    if (!dateRecord) {
      return c.json({ message: [] });
    }

    const todos = await prisma.todo.findMany({
      where: { 
        dateId: dateRecord.id 
      },
      include: { 
        subtasks: true 
      },
    });

    return c.json({ message: todos });
  
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json({ 
      message: "Failed to fetch todos" 
    }, 500);
  }
});


app.post('/user/addtodo', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");
  const { date, title, description, priority, subtasks } = await c.req.json();

  try {
    let dateRecord = await prisma.date.findFirst({ 
      where: { 
        userId, date 
      } 
    });
    if (!dateRecord) {
      dateRecord = await prisma.date.create({ 
        data: { 
          date, userId
        } 
      });
    }

    const newTodo = await prisma.todo.create({
      data: {
        dateId: dateRecord.id,
        title: title,
        description,
        priority,
        status: false,
      },
    });

    if (subtasks && subtasks.length) {
      const subtaskData = subtasks.map((subtask: any) => ({
        content: subtask.content,
        status: false,
        todoId: newTodo.id,
      }));
      await prisma.subtask.createMany({ 
        data: subtaskData 
      });
    }

    const todos = await prisma.todo.findMany({
      where: { 
        dateId: dateRecord.id 
      },
      include: { 
        subtasks: true 
      },
    });

    return c.json({ 
      message: todos
    });

  } catch (error) {
    console.error("Error adding todo:", error);
    return c.json({ 
      message: "Failed to add todo" 
    }, 500);
  }
});


app.patch('/user/updatetodo', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const { index, completed } = await c.req.json();

  try {
    await prisma.todo.update({
      where: { 
        id: index 
      },
      data: { 
        status: completed
      },
    });

    return c.json({ 
      message: "Todo updated successfully" 
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json({ 
      message: "Failed to update todo" 
    }, 500);
  }
});


app.patch('/user/updatesubtask', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const { subtaskId, completed } = await c.req.json();

  if (!subtaskId) {
    return c.json({ message: "Subtask ID is required" }, 400);
  }

  try {
    const updatedSubtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: { status: completed },
    });

    return c.json({ 
      message: "Subtask updated successfully", 
      subtask: updatedSubtask 
    });
  
  } catch (error) {
    console.error("Error updating subtask:", error);
    return c.json({ 
      message: "Failed to update subtask" 
    }, 500);
  }
});


app.delete('/user/deletetodo', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const todoId = c.req.query("id");

  try {
    await prisma.subtask.deleteMany({ 
      where: { 
        todoId 
      } 
    });
    await prisma.todo.delete({ 
      where: { 
        id: todoId 
      } 
    });

    return c.json({ 
      message: "Todo and subtasks deleted successfully" 
    });
  
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json({ 
      message: "Failed to delete todo" 
    }, 500);
  }
});

// Fetch user todo stats for tracker
app.get('/user/tracker', async (c) => {
  const prisma = initializePrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");

  try {
    const stats = await prisma.date.findMany({
      where: { userId },
      select: {
        date: true,
        todos: {
          select: { 
            id: true, 
            status: true 
          },
        },
      },
    });

    const todosStats = stats.map(({ date, todos }) => ({
      date,
      totalTodos: todos.length,
      completedTodos: todos.filter((todo) => todo.status).length,
    }));

    return c.json({ 
      message: todosStats 
    });

  } catch (error) {
    console.error("Error fetching tracker stats:", error);
    return c.json({ 
      message: "Failed to fetch tracker stats" 
    }, 500);
  }
});

export default app;
