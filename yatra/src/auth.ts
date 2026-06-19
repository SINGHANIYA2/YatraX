import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import connectDb from "./lib/db"
import User from "./models/user.models"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
            email: {
                type: "email",
                label: "Email",
                placeholder: "johndoe@gmail.com",
            },
            password: {
                type: "password",
                label: "Password",
                placeholder: "*****",
            },
        },

        async authorize(credentials, request) {
            const email = credentials.email
            const password = credentials.password as string
            
            if(!email || !password){
                throw Error("MIssing Details")
            }
            await connectDb()

            const user = await User.findOne({email})
            if(!user){
                throw Error("User doesnot exist")
            }

            const isMatched = await bcrypt.compare(password ,user.password)
            
            if(!isMatched){
                throw Error("Incorreect Password")
            }
            
            return {
                id:user._id.toString(),
                email:user.email,
                role:user.role,
                name:User.name
            }
        },
    }),
    Google ({
        clientId:process.env.AUTH_GOOGLE_ID,
        clientSecret:process.env.AUTH_GOOGLE_SECRET
    })
],
    callbacks:{

        async signIn({user,account}){
            if(account?.provider == "google"){
                await connectDb()
                let dbuser = await User.findOne({email:user.email})
                
                if(!dbuser){
                    dbuser = await User.create({
                        name:user.name as string,
                        email:user.email as string,
                    })
                }

                user.id = dbuser._id.toString()
                user.role = dbuser.role as string
            }
            return true
        },

        async jwt({token , user}){
            if(user){

                token.name=user.name
                token.id=user.id
                token.email=user.email
                token.role=user.role
            }
            
            return token
        },
        async session ({token ,session}){
            
            if(session.user){
                session.user.name=token.name as string
                session.user.id=token.id as string
                session.user.email=token.email as string
                session.user.role=token.role as string
                
            }
            return session
            
        }
        ,
    },
    
    pages:{
        signIn:"/signin",
        error:"signin"
    },
    session:{
        strategy:"jwt",
        maxAge:10*24*60*60
    },
    secret : process.env.AUTH_SECRET
    
    
})

