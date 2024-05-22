import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'
import zod from 'zod'

// const schema = .....
// const result = schema.safeParse(detail)

const emailSchema = zod.string().email();

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_STRING: string
  },
  Variables: {
    userId: string;
  }
}>();

app.use('*', cors())

// const jwt_secret = "password"

type SignUpDetail = {
  firstname: string,
  lastname: string,
  email: string,
  password: string
}

app.post('/register', async (c) => {

  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  
  const detail: SignUpDetail = await c.req.json();

  const zodResult = emailSchema.safeParse(detail.email)
  if(!zodResult.success){
    c.status(400);
    return c.json({
      message: zodResult
    })
  }

  if(detail.password === "" || detail.firstname === ""){
    c.status(400)
    return c.json({
      message: "Invalid Credential"
    })
  }

  try {
    const response = await prisma.user.findUnique({
      where: {
        email: detail.email,
      },
    })

    if (response != null) {
      c.status(400)
      return c.json({
        message: "User Already Exist"
      })
    }

    const saltRounds = 10;
    const hashpassword = await bcrypt.hash(detail.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        firstname: detail.firstname,
        lastname: detail.lastname,
        email: detail.email,
        password: hashpassword
      },
    })

    const token = await sign({ id: user.id }, c.env.JWT_STRING);

    c.status(200);
    return c.json({
      message: token
    })

  } catch (error) {
    console.error("Server Site Error is Signup: ", error);
  }

})


type SigninDetail = {
  email: string,
  password: string
}

app.get('/login', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const detail: Record<string,string> = await c.req.header();
  const zodResult = emailSchema.safeParse(detail.email)
  if(!zodResult.success){
    return c.json({
      message: zodResult
    })
  }

  console.log(detail);

  try {
    const response = await prisma.user.findUnique({
      where: {
        email: detail.email,
      },
    })

    if(response === null){
      return c.json({
        message: "User Does not Exist"
      })
    }

    const isMatch = await bcrypt.compare(detail.password, response.password)
    if(!isMatch){
      return c.json({
        message: "Invalid Credentials"
      })
    }

    const token = await sign({ id: response.id }, c.env.JWT_STRING);

    return c.json({
      message: token
    })

  } catch (error) {
    console.error("Server Site error in Signin: ", error)
  }
})

// Middleware
app.use("/user/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  console.log("middle ware called");

  try {
      const user = await verify(token, c.env.JWT_STRING)
      c.set("userId", user.id);

      await next();

  } catch (err) {
      
      return c.json({
          message: "You Are Not Logged In"
      })
  }
})


app.get('/user/fetchtodo', async(c) =>{
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const date: any = await c.req.query('date');
  const userId = c.get("userId");

  console.log("backend " + date);

  try {
    const response = await prisma.date.findFirst({
      where:{
        userId: userId,
        date: date
      }
    })

    if(response === null){
      return c.json({
        message: []
      });
    }

    const todos = await prisma.todo.findMany({
      where: {
        dateId: response.id
      }
    })

    return c.json({
      message: todos
    })

  } catch (error) {
    console.error("Server Side Error in Fetching Todo: ", error);
  }
  
})


type AddDetail = {
  date: string,
  addTodo: string
}

app.post('/user/addtodo', async(c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const userId = c.get("userId");
  const detail: AddDetail = await c.req.json();

  try {
    const dates = await prisma.date.findFirst({
      where:{
        userId: userId,
        date: detail.date
      }
    })

    if(dates != null){
      const createTodo = await prisma.todo.create({
        data:{
          dateId: dates.id,
          content: detail.addTodo,
          status: false
        }
      })

      return c.json({
        message: createTodo
      })
    }

    else {
      const createDate = await prisma.date.create({
        data: {
          date: detail.date,
          userId: userId
        },
      })
  
      const createTodo = await prisma.todo.create({
        data:{
          dateId: createDate.id,
          content: detail.addTodo,
          status: false
        }
      })

      return c.json({
        message: createTodo
      })
    }

  } catch (error) {
    console.error("Server Side Error in AddingTodo: ", error)
  }

})


type UpdateDetail = {
  index: string,
  completed: boolean
}

app.patch('/updatetodo', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const detail: UpdateDetail = await c.req.json();

  try {
    const response = await prisma.todo.update({
      where: {
        id: detail.index,
      },
      data: {
        status: detail.completed
      },
    })

    return c.json({
      message: "Updated Successfully"
    })

  } catch(error){
    console.error("Server Side Error in Updating Todo: ", error);
  }
})


type DeleteDetail = {
  index: string
}

app.delete('/deletetodo', async(c) =>{

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const detail: any = await c.req.query('id')
  console.log(detail);

  try {
    const deleteTodo = await prisma.todo.delete({
      where: {
        id: detail
      },
    })

    console.log(deleteTodo);

    return c.json({
      message: "Todo Deleted Successfully"
    })
  } catch (error) {
    console.error("Error in Deleting Todo: ", error); 
  }
})


app.get('/user/tracker', async(c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const userId = c.get("userId");

  try {
        const todosStats = [];

        const datesArray = await prisma.date.findMany({
          where:{
            userId: userId,
          }
        })
    
        // Loop through each date in the array
        for (const date of datesArray) {
          // Calculate total todos for the date
          const totalTodos = await prisma.todo.count({
            where: {
              dateId: date.id
            }
          });
    
          // Calculate total completed todos for the date
          const completedTodos = await prisma.todo.count({
            where: {
              dateId: date.id,
              status: true
            }
          });
    
          // Push the stats for the current date to the todosStats array
          todosStats.push({
            date: date.date,
            totalTodos: totalTodos,
            completedTodos: completedTodos
          });
        }
    
        // Return the todosStats array with stats for each date
        return c.json({
          message: todosStats
        })

      } catch (error) {
        console.error('Error calculating todos stats:', error);
      }
})


export default app

