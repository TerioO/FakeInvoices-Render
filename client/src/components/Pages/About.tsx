export default function About() {
    return (
        <div>
            <h1>About</h1>
            <p>Roles permissions: </p>
            <ol>
                <li>
                    USER
                    <ul>
                        <li>No access to USERS route</li>
                        <li>No access to INVOICES route</li>
                        <li>Can read his own DB entry</li>
                        <li>Can read his own invoices</li>
                    </ul>
                </li>
                <li>
                    READER
                    <ul>
                        <li>
                            Can read a list of all the users with role="USER"
                            (USERS route)
                        </li>
                        <li>Can read any user with role="USER"</li>
                        <li>
                            Can read a list of all invoices assigned to users
                            with role="USER" (INVOICES route)
                        </li>
                        <li>
                            Can read any invoice assigned to a user with
                            role="USER"
                        </li>
                    </ul>
                </li>
                <li>
                    OWNER
                </li>
            </ol>
        </div>
    );
}
