import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link> |{" "}
      <Link href="/skills">Skills</Link> |{" "}
      <Link href="/auth/login">Login</Link>|{" "}
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
