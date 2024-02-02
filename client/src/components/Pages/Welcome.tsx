export default function Welcome() {
    return (
        <div>
            <h1>Welcome</h1>
            <p>
                This is an app for managing fake invoices, made in a responsive
                design.
            </p>

            <p>
                You can view how the app behaves when a USER is logged in, read
                from the users list and the account password is firstName-00000 E.g: (email:Reed@fake.com password:Reed-00000)
            </p>

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
                    User authentication with assigned roles: USER, ADMIN, OWNER
                </li>
                <li>Automatic session refresh</li>
                <li>
                    Remember me function for persisting login state (You need to
                    allow 3rd party cookies for this to work)
                </li>
                <li>Protected routes by user role/auth state</li>
                <li>Each new user will have a few fake invoices created</li>
                <li>
                    Each USER can view his own invoices and download a pdf
                    version of it
                </li>
                <li>Each ADMIN can view a list of all the users/invoices</li>
                <li>Each new user is assigned USER role</li>
                <li>By default the database contains a few fake users</li>
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
                        <li>jspdf</li>
                        <li>html2canvas</li>
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
                        <li>cors</li>
                        <li>bcrypt</li>
                        <li>dotenv</li>
                        <li>envalid</li>
                        <li>htt-errors</li>
                        <li>jsonwebtoken</li>
                        <li>cookie-parser</li>
                    </ul>
                </li>
            </ul>

            <p>
                Further improvements are required for adding mutations from
                frontend, filtering lists, registration validation with using
                Regex, ...
            </p>
        </div>
    );
}
