export default function Welcome() {
    return (
        <div>
            <h1>Welcome</h1>
            <p>This is an app for managing fake invoices.</p>
            <p>Check ABOUT for more details</p>
            <p>Features: </p>
            <ul>
                <li>
                    Auth done with JWT, creating 2 tokens: Access and Refresh
                    token
                </li>
                <li>Access token is saved in memory</li>
                <li>
                    Refresh token is saved as httpOnly cookie over secure HTTPS
                    and used to generate Access tokens
                </li>
                <li>
                    User authentication with assigned roles: USER, READER, OWNER
                </li>
                <li>User authentication with email verification</li>
                <li>Automatic session refresh</li>
                <li>
                    Remember me function for persisting login state (You need to
                    allow 3rd party cookies for this to work)
                </li>
                <li>Protected routes by user role/auth state</li>
                <li>
                    Invoice PDFs which can be viewed/downloaded from client or
                    sent to email
                </li>
            </ul>

            <p>Stack Frontend: </p>
            <ul>
                <li>React</li>
                <li>Redux Toolkit & RTK Query</li>
                <li>MUI</li>
                <li>React Router</li>
                <li>SASS</li>
                <li>Bundler: Vite</li>
                <li>
                    Packages:
                    <ul>
                        <li>dayjs</li>
                        <li>jwtdecode</li>
                    </ul>
                </li>
            </ul>

            <p>Stack Backend: </p>
            <ul>
                <li>NodeJS, TypeScript, ExpressJS</li>
                <li>MongoDB - mongoose</li>
                <li>
                    Packages:
                    <ul>
                        <li>cookie-parser</li>
                        <li>cors</li>
                        <li>cross-env</li>
                        <li>dayjs</li>
                        <li>dotenv</li>
                        <li>envalid</li>
                        <li>http-errors</li>
                        <li>jsonwebtoken</li>
                        <li>pdfmake</li>
                    </ul>
                </li>
            </ul>

            <p>
                There are further improvements to be made, filtering and sorting
                for USERS and INVOICES route and other things to add...
            </p>
        </div>
    );
}
