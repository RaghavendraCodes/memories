import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpValidationSchema } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { createUserAccount } from "@/lib/appwrite/api"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-queries/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignUpForm = () => {

  const {toast} = useToast(); 
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof signUpValidationSchema>>({
      resolver: zodResolver(signUpValidationSchema),
      defaultValues: {
        name: '', 
        username: '',
        email: '', 
        password: ''
      },
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signUpValidationSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      const newUser = await createUserAccount(values);
      
      if(!newUser) {
        return toast({
          title: 'sign up failed! please try again.'
        })
      }

      const session = await signInAccount({email: values.email, password: values.password}); 

      if(!session) {
        return toast({
          title: 'sign in failed. please try again'
        })
      }

      const isLoggedIn = await checkAuthUser(); 

      if(isLoggedIn) {
        form.reset(); 
        navigate('/')
      } else {
        return toast({title: 'signup failed.'})
      }
  }

  return (
      <Form {...form}>
        <div className="sm:w-[420px] flex-center flex-col">
          <img src="/assets/icons/logomain.svg" className="h-9 w-auto"/>
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">To use memories enter your details.</p>
        
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 xl:w-2/3 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {isCreatingAccount ? (
            <div className="flex-center gap-2">
              <Loader/> Loading...
            </div>
          ) : "Sign up"}
        </Button>
        <p className="text-small-regular text-light-2 text-center mt-2">Already have an account ?
        <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
        </p>
      </form>
      </div>
    </Form>
  )
}

export default SignUpForm;

