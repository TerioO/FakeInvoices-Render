export default function About() {
    return (
        <div>
            <h1>About</h1>
            <p>Creating an account:</p>
            <ul>
                <li>
                    Account email must be from provider: [gmail.com, yahoo.com,
                    yahoo.ro, outlook.com, hotmail.com, hotmail.ro,
                    protonmail.com, proton.me, icloud.com, aol.com], this is to
                    simplify my job so I don't have to validate emails
                </li>
                <li>
                    When an account is created, the app will try a login which
                    will fail and a link to verify the account will be sent to
                    your email. This might take a few minutes and you will be
                    blocked from sending another verification link. If the link
                    is not sent, try another login after the block period
                    expires (15 minutes)
                </li>
                <li>
                    The account will be assigned a USER role, which has the
                    least permissions and will appear in the USERS route
                </li>
            </ul>
            <p>Requests:</p>
            <ul>
                <li>
                    If you're a USER/READER you can make a request and send a
                    message to the OWNER to for example be granted a higher role
                </li>
                <li>
                    You can also request for email change which will need to be
                    verified on login
                </li>
            </ul>
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
                    <ul>
                        <li>Can read any USER, READER in the database</li>
                        <li>Can read any invoice in the database</li>
                        <li>
                            Can update USER, READER accounts (only password,
                            email and role available)
                        </li>
                        <li>Can read REQUESTS made by USERS/READERS</li>
                    </ul>
                </li>
            </ol>
        </div>
    );
}
