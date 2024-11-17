import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { SignInDrawer } from "./sign-in-drawer"

interface ProtectedRoutePlaceholderProps {
  title?: string
  description?: string
}

export function SignInPromptCard({
  title = "Authentication Required",
  description = "Please sign in to access this content",
}: ProtectedRoutePlaceholderProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 -z-10" />
      
      <Card className="w-full max-w-md border-neutral-200/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>
            Sign in to unlock access to all features and content.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <SignInDrawer />
        </CardFooter>
      </Card>
    </div>
  )
} 