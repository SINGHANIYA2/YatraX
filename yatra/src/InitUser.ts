'use client'

import { useSession } from 'next-auth/react'
import useGetMe from './hooks/useGetMe'
import useGetPartnerMe from './hooks/useGetPartnerMe'
import useGetAdminMe from './hooks/useGetAdminMe'

function InitUser() {
  const { data: session, status } = useSession();

  const role = session?.user?.role;

  useGetMe(
    status === "authenticated" &&
    role === "user"
  );

  useGetPartnerMe(
    status === "authenticated" &&
    role === "partner"
  );

  useGetAdminMe(
    status === "authenticated" &&
    role === "admin"
  );

  return null;
}

export default InitUser;