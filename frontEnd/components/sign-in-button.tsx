import { Github } from "lucide-react"
import { Button } from "./ui/button"
import { login } from "@/lib/server-actions"
 
export default function SignInButton() {
  return (
    <form
      action={login}
    >
      {/* <button 
        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Sign in with GitHub
      </button> */}
      <Button 
            variant="outline"
        type="submit"

            size="lg"
            className="w-full max-w-sm flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Github className="w-5 h-5" />
        Continue with GitHub
      </Button>
    </form>
  )
} 