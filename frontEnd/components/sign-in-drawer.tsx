import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import SignInButton from "./sign-in-button"

export function SignInDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[50vh] sm:h-[385px] p-6">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl font-bold">
            Sign in to Continue
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center justify-center space-y-4 mt-8">
          <SignInButton />
        </div>
      </DrawerContent>
    </Drawer>
  )
} 
