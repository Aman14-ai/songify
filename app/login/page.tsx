import { Logo } from "@/components/Logo";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>

          <div>
            <CardTitle>Login to Songify</CardTitle>
            <CardDescription>
              Continue with your Google account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <GoogleLoginButton />
        </CardContent>
      </Card>
    </main>
  );
}