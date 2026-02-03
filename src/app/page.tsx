import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    // Om inloggad, gå till dashboard
    redirect('/dashboard');
  } else {
    // Om inte inloggad, gå till login
    redirect('/auth/login');
  }
}
