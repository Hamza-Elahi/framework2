<?php
/**
 * Base class for AJax operations
 *
 * @author Lindsay Marshall <lindsay.marshall@ncl.ac.uk>
 * @copyright 2020 Newcastle University
 */
    namespace Framework\Ajax;

    use \Support\Context;
/**
 * Ajax operation base class
 */
    abstract class Ajax
    {
/**
 * @var Ajax
 */
        protected $controller;
/**
 * @var Context
 */
        protected $context;
/**
 * Constructor
 */
        public function __construct(Context $context, Ajax $controller)
        {
            $this->context = $context;
            $this->controller = $controller;
            $this->checkPerms($context->user, $this->requires());
        }
/**
 * Check that a bean has a field. Do not allow id field to be manipulated.
 *
 * @param string    $type    The type of bean
 * @param string    $field   The field name
 * @param bool      $idok    Allow the id field
 *
 * @throws \Framework\Exception\BadValue
 * @return bool
 */
        final protected function fieldExists(string $type, string $field, bool $idok = FALSE) : bool
        {
            if (!\Support\SiteInfo::hasField($type, $field) || (!$idok && $field === 'id'))
            {
                throw new \Framework\Exception\BadValue('Bad field: '.$field);
                /* NOT REACHED */
            }
            return TRUE;
        }
/**
 * Check access to a bean
 *
 * @param ?\RedBeanHP\OODBBean  $user
 * @param array                 $permissions
 * @param string                $bean
 * @param string                $field
 *
 * @return void
 */
        final protected function checkAccess(?\RedBeanHP\OODBBean $user, array $permissions, string $bean, string $field = '', bool $idOK = FALSE) : void
        {
            if (isset($permissions[$bean]))
            { # there are some permissions
                $access = $permissions[$bean];
                if (is_object($user) || !$access[0])
                { # either we have a user or no login required
                    $checks = count($access) == 2 ? $access[1] : [ [$access[1], $access[2]] ];
                    foreach ($checks as $check)
                    {
                        $this->checkPerms($user, $check[0]); // check user plays the right roles
                        if ($field === '' || empty($check[1]) || (in_array($field, $check[1]) && ($field != 'id' || $idOK)))
                        {
                            return;
                        }
                    }
                }
            }
            throw new Forbidden('Permission denied: '.$bean);
            /* NOT REACHED */
        }
/**
 * Check that user has the permissions that are specified in an array
 *
 * @param ?\RedBeanHP\OODBBean  $user      The current user or NULL
 * @param array                 $pairs     The permission array
 *
 * @throws Forbidden
 * @return void
 * @psalm-suppress PossiblyNullReference
 */
        final private function checkPerms(?\RedBeanHP\OODBBean $user, array $pairs) : void
        {
            if (!empty($pairs) && $user == NULL)
            {
                throw new Forbidden('Permission denied');
            }
            foreach ($pairs as $rcs)
            {
                if (is_array($rcs[0]))
                { // this is an OR
                    foreach ($rcs as $orv)
                    {
                        if (is_object($user->hasRole($orv[0], $orv[1])))
                        {
                            continue 2;
                        }
                    }
                    throw new Forbidden('Permission denied');
                }
                if (!is_object($user->hasRole($rcs[0], $rcs[1])))
                {
                    throw new Forbidden('Permission denied');
                }
            }
        }
/**
 * Return permission requirements
 *
 * @return array
 */
        public function requires()
        {
            return [TRUE, []]; // default to requiring login
        }
/**
 * Handle AJAX operations
 *
 * @return void
 */
        abstract public function handle() : void;
    }
?>