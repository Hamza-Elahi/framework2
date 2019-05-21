<?php
/**
 * A trait that allows extending the UserLogin class for different authentication processes
 *
 * @author Lindsay Marshall <lindsay.marshall@ncl.ac.uk>
 * @copyright 2019 Newcastle University
 *
 */
    namespace Support;
/**
 * Allows developers to change the way logins and logouts are handled.
 */
    trait Login
    {
/**
 * Process the login form
 *
 * Diifferent kinds of logins might be required. This is the default
 * that uses the local database table.
 *
 * @see class/framework/pages/userlogin.php
 *
 * @param \Support\Context $context
 *
 * @return bool
 */
        public function checkLogin(\Support\Context $context) : bool
        {
            $fdt = $context->formdata();
            if (($lg = $fdt->post('login', '')) !== '')
            {
                $page = $fdt->post('page', '');
                $pw = $fdt->post('password', '');
                if ($pw !== '')
                {
                    $user = \Framework\Pages\UserLogin::eorl($lg); // use either a login name or the email address - see framework/pages/userlogin.php
                    if (is_object($user) && $user->pwok($pw) && $user->confirm)
                    {
                        if (session_status() != PHP_SESSION_ACTIVE)
                        { # no session started yet
                            session_start(['name' => Config::SESSIONNAME, 'cookie_path' => $local->base().'/']);
                        }
                        $_SESSION['user'] = $user;
                        $context->divert($page === '' ? '/' : $page); # success - divert to home page
                        /* NOT REACHED */
                    }
                }
                $local->message(Local::MESSAGE, 'Please try again.');
                return FALSE;
            }
            else
            {
                $page = $fdt->get('page', '');
            }
            $context->local()->addval('page', $page);
            return TRUE;
        }
/**
 * Handle a logout
 *
 * Clear all the session material if any and then divert to the /login page
 *
 * Code taken directly from the PHP session_destroy manual page
 *
 * @link	http://php.net/manual/en/function.session-destroy.php
 *
 * @param \Support\Context	$context	The context object for the site
 *
 * @return void
 */
        public function logout(Context $context)
        {
            $_SESSION = []; # Unset all the session variables.

            # If it's desired to kill the session, also delete the session cookie.
            # Note: This will destroy the session, and not just the session data!
            if (ini_get('session.use_cookies'))
            {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            if (session_status() == PHP_SESSION_ACTIVE)
            { # no session started yet
                session_destroy(); # Finally, destroy the -session.
            }
            $context->divert('/');
        }
    }
?>