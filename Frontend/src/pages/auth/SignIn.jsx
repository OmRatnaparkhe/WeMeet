import { SignIn } from "@clerk/clerk-react";

export function Signin() {
  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center">
      <SignIn routing="path" path="/signin" />
    </div>
  );
}
