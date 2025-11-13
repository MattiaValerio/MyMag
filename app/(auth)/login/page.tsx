import { signIn } from "@/auth"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

async function login(formData: FormData) {
  "use server"
  const email = formData.get("email")?.toString() ?? ""
  const password = formData.get("password")?.toString() ?? ""
  await signIn("credentials", { email, password, redirectTo: "/dashboard" })
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <form action={login}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Accedi</CardTitle>
            <CardDescription>Gestione Magazzino</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button className="w-full" type="submit">Entra</Button>
          </CardContent>
        </Card>
      </form>
    </AuthLayout>
  )
}
