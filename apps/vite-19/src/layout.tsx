import { UserfrontProvider } from "@userfront/react";
import { Outlet } from "react-router-dom";

function Layout({ children }: { children: React.ReactNode }) {

    return (

        <html lang="en" className="dark:bg-black dark:text-white">
            <body className="flex justify-center ">
                <UserfrontProvider
                    tenantId={import.meta.env.NEXT_PUBLIC_USERFRONT_TENANT_ID ?? ""}
                    loginRedirect="/dashboard"
                    requireAuth
                >
                    <div className="min-h-screen flex justify-center items-center text-center ">
                        <Outlet />
                    </div>
                    <div className="absolute flex flex-col justify-center items-center w-full space-y-4 bottom-0 p-4">
                        <a
                            href="https://github.com/userfront/userfront"
                            target="_blank"
                            className="flex items-center"
                        >
                            <img
                                src="https://img.shields.io/github/stars/userfront/userfront?style=social"
                                alt="Star Userfront on GitHub"
                            />
                        </a>
                        <a
                            href="https://userfront.com/"
                            target="_blank"
                            className="group flex items-center justify-center gap-x-1 text-sm"
                        >
                            <div className="mt-[3.25px] leading-none opacity-40 transition-opacity duration-300 ease-in-out group-hover:opacity-80">
                                Secured by
                            </div>
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="115 130 120 40"
                                    width={85}
                                    height={20}
                                    className="opacity-60 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                                >
                                    <g
                                        className="fill-black dark:fill-white"
                                        transform="matrix(2.708255436667925,0,0,2.708255436667925,91.43817255618264,125.69340771418473)"
                                    >
                                        <path d="M7.59 13.78L7.59 6.83L5.82 6.83L5.82 10.42C5.82 11.65 5.22 12.35 4.09 12.35C3.08 12.35 2.52 11.77 2.52 10.81L2.52 6.83L0.76 6.83L0.76 10.98C0.76 12.78 1.92 13.89 3.46 13.89C4.73 13.89 5.38 13.30 5.66 12.66L5.85 12.66L5.85 13.78ZM9.02 8.79C9.02 10.08 9.90 10.68 11.84 10.95L12.05 10.98C12.81 11.07 13.52 11.13 13.52 11.65C13.52 12.19 12.87 12.49 12.18 12.49C11.28 12.49 10.36 12.04 9.93 11.13L8.51 12.01C9.16 12.99 10.22 13.97 12.14 13.97C13.99 13.97 15.26 12.98 15.26 11.62C15.26 10.35 14.43 9.79 12.21 9.49L12.00 9.46C11.27 9.37 10.75 9.28 10.75 8.78C10.75 8.36 11.12 8.09 11.75 8.09C12.67 8.09 13.37 8.62 13.90 9.25L15.18 8.25C14.24 7.27 13.23 6.64 11.80 6.64C10.19 6.64 9.02 7.50 9.02 8.79ZM15.99 10.25C15.99 12.40 17.49 13.97 19.56 13.97C21.42 13.97 22.23 12.99 22.71 12.26L21.20 11.40C20.96 11.89 20.51 12.43 19.53 12.43C18.52 12.43 17.86 11.72 17.82 10.82L22.96 10.82L22.96 10.14C22.96 8.05 21.55 6.64 19.53 6.64C17.49 6.64 15.99 8.15 15.99 10.25ZM17.84 9.59C17.95 8.76 18.52 8.18 19.52 8.18C20.43 8.18 21.04 8.74 21.14 9.59ZM25.96 6.83L24.22 6.83L24.22 13.78L25.98 13.78L25.98 9.88C25.98 8.90 26.63 8.43 27.52 8.43L28.56 8.43L28.56 6.80L27.86 6.80C26.98 6.80 26.39 7.07 26.12 7.84L25.96 7.84ZM29.06 6.83L29.06 8.37L30.83 8.37L30.83 13.78L32.59 13.78L32.59 8.37L34.41 8.37L34.41 6.83L32.59 6.83L32.59 5.94C32.59 5.66 32.73 5.52 32.98 5.52L34.05 5.52L34.05 3.98L32.23 3.98C31.42 3.98 30.83 4.59 30.83 5.40L30.83 6.83ZM37.32 6.83L35.59 6.83L35.59 13.78L37.35 13.78L37.35 9.88C37.35 8.90 38.00 8.43 38.89 8.43L39.93 8.43L39.93 6.80L39.23 6.80C38.35 6.80 37.76 7.07 37.49 7.84L37.32 7.84ZM40.54 10.30C40.54 12.49 42.14 13.97 44.18 13.97C46.23 13.97 47.82 12.49 47.82 10.30C47.82 8.12 46.23 6.64 44.18 6.64C42.14 6.64 40.54 8.12 40.54 10.30ZM42.31 10.30C42.31 9.07 43.06 8.26 44.18 8.26C45.30 8.26 46.06 9.07 46.06 10.30C46.06 11.54 45.30 12.35 44.18 12.35C43.06 12.35 42.31 11.54 42.31 10.30ZM49.08 6.83L49.08 13.78L50.85 13.78L50.85 10.19C50.85 8.96 51.45 8.26 52.58 8.26C53.59 8.26 54.15 8.83 54.15 9.80L54.15 13.78L55.92 13.78L55.92 9.63C55.92 7.83 54.75 6.72 53.21 6.72C51.94 6.72 51.30 7.31 51.02 7.95L50.82 7.95L50.82 6.83ZM56.81 6.83L56.81 8.37L58.58 8.37L58.58 12.43C58.58 13.22 59.16 13.78 59.95 13.78L61.85 13.78L61.85 12.24L60.73 12.24C60.48 12.24 60.34 12.10 60.34 11.82L60.34 8.37L62.24 8.37L62.24 6.83L60.34 6.83L60.34 4.68L58.58 4.68L58.58 6.83Z"></path>
                                    </g>
                                </svg>
                            </div>
                        </a>
                    </div>
                </UserfrontProvider>
            </body>
        </html>
    );
}

export default Layout;
