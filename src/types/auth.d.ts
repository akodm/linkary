export declare module 'next-auth' {
  interface User {
    email: string;
    slug: string;
    role: string;
  }
  interface Session {
    user: {
      email: string;
      slug: string;
      role: string;
    };
    error?: string;
    recovery?: { check: boolean; value: boolean };
  }
}
export declare module '@auth/core/jwt' {
  interface JWT {
    email: string;
    slug: string;
    role: string;
    error?: string;
    recovery?: { check: boolean; value: boolean };
  }
}
