import { SignUp } from "@clerk/clerk-react";

export function Signup() {
  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center">
      <SignUp routing="path" path="/signup" />
    </div>
  );
}
