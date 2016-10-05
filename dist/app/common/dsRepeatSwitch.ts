// I am a Switch/Case directive that is intended to work in conjunction with
// an ngRepat directive. I precompile the children tags with the attribute,
// 'bn-repeat-switch-when (case/when) tags and then link them for each cloned
// item in the ngRepeat rendering. Currently, this directive will clear out the
// contents of the ngRepeat before rendering the appropriate 'case' template.
export default angular.module('DroneSense.Web.RepeatSwitch', []).directive(
    'bnRepeatSwitch', ['$parse', '$compile',
    function( $parse: any, $compile: any ): any {
        // I provide a means to pass the switch expression, switch cases, and
        // other settings from this 'priority' of the directive to the next
        // priority of the same directive.
        function Controller(): any {
            // I hold the parsed expression that each ngRepeat clone will have
            // to $watch() in order to figure out which template to render.
            this.expression = null;
            // I hold the linking functions for each 'case' template.
            // --
            // NOTE: I am using .create(null) here in order to make sure that
            // this object does NOT inherit keys from any other prototype. This
            // allows us to check keys on this object without having to worry
            // about inheritance (supported in IE9+).
            this.cases = Object.create( null );
            // I determine if the switch-expression should be allowed to change
            // once, or multiple times. If only once, the code is optimized to
            // stop caring.
            this.switchOnce = false;
        }
        // I compile the ngRepeat element (before ngRepeat executes) in order to
        // pre-compile the rendering templates and prepare the linking functions.
        function compile( tElement: any, tAttributes: any ): any {
            // Parse the expression that we want to watch/switch-on in each of
            // the individual ngRepeat elements. By parsing it here, during the
            // compilation phase, we save the overhead of having to parse it
            // every time the ngRepeat elements is cloned and linked.
            var switchExpression: any = $parse( tAttributes.bnRepeatSwitch );
            // Find all the children elements that make up the 'case' statements,
            // strip them out, and compile them. This way, we can simply clone
            // and link them later on.
            // --
            // NOTE: Since we are manually querying the DOM for these elements,
            // we have to make assumptions about the format of the target
            // attribute. We don't get to rely on the normalization AngularJS
            // usually gives us (in the Attributes collection).
            var switchCases: any = {};
            // Check to see if the user only wants to check the switch expression
            // once; this will allow the watchers to unbind after the first digest
            // which should help with long-term performance of the page.
            var switchOnce: any = ( tAttributes.switchOnce === 'true' );
            // Find, compile, and remove case-templates.
            tElement
                .children( '[ bn-repeat-switch-when ]' )
                .remove()
                .each(
                function iterateOverCaseTemplates(): any {
                    var node: any = angular.element( this );
                    var caseValue: any = node.attr( 'bn-repeat-switch-when' );
                    var caseLinkFunction: any = $compile( node.removeAttr( 'bn-repeat-switch-when' ) );
                    switchCases[ caseValue ] = caseLinkFunction;
                }
            )
            ;
            // Clear out any remaining content - the current state of this
            // directive is not designed to use positional DOM insertion (the way
            // that ngSwitchWhen does).
            tElement.empty();
            // Remove the switch-once attribute (if exists); we no longer need it
            // and it will only add weight to the DOM at this point.
            if ( 'switchOnce' in tAttributes ) {
                tElement.removeAttr( tAttributes.$attr.switchOnce );
            }
            // Clean up references that we no longer need.
            tElement = null;
            tAttributes = null;
            // Return the linking function (which will run before the ngRepeat
            // linking phase).
            return( link );
            // The primary purpose of this linking phase, for this directive,
            // is to copy the switch expression and the case-link-functions into
            // the current Controller so that they can be made available to the
            // lower-priority version of this directive (which will link every
            // time the ngRepeat element is cloned and linked).
            function link( $scope: ng.IScope, element: any, attributes: any, controller: any ): any {
                // Store the switch configuration.
                controller.expression = switchExpression;
                controller.cases = switchCases;
                controller.switchOnce = switchOnce;
                // Since our Controller is going to be passed-around, we should
                // probably tear it down in order to help prevent unexpected
                // memory references from sticking around.
                $scope.$on(
                    '$destroy',
                    function handleDestroyEvent(): any {
                        controller.expression = null;
                        controller.cases = null;
                        controller.switchOnce = null;
                        controller = null;
                        // NOTE: We cannot tear-down compiled elements as those
                        // may be used in a subsequent linking phase.
                    }
                );
            }
        }
        // Return the directive configuration. Note that this 'version' of the
        // bnRepeatSwitch directive has to execute with priority 1,001 so that
        // it is compiled BEFORE the ngRepeat is compiled and linked (at 1,000).
        return({
            compile: compile,
            controller: Controller,
            priority: 1001,
            required: 'bnRepeatSwitch',
            restrict: 'A'
        });
    }
    ]).directive(
    'bnRepeatSwitch',
    function(): any {
        // After each ngRepeat element is cloned and linked I set up the watcher
        // to render the appropriate template as the expression outcome changes.
        function link( scope: any, element: any, attributes: any, switchController: any ): any {
            // Start watching the precompiled expression.
            var stopWatching: any = scope.$watch(
                switchController.expression,
                function handleSwitchExpressionChange( newValue: any, oldValue: any ): any {
                    // If the user does not expect the switch expression to ever
                    // change, then we can unbind the watcher after the watcher
                    // is configured.
                    if ( switchController.switchOnce ) {
                        stopWatching();
                    }
                    var linkFunction: any = switchController.cases[ newValue ];
                    // If there was no matching case statement template, just
                    // clear out the content.
                    if ( ! linkFunction ) {
                        return( element.empty() );
                    }
                    // If the expression outcome is changing, clear out the
                    // content before rendering the new template.
                    if ( newValue !== oldValue ) {
                        element.empty();
                    }
                    // Clone the case template and inject it into the DOM.
                    linkFunction(
                        scope,
                        function handleCaseTemplateCloneLinking(clone: any ): any {
                            element.append( clone );
                        }
                    );
                }
            );
        }
        // Return the directives configuration. Require the Controller from the
        // higher-priority version of the bnRepeatSwitch directive so that we can
        // access the Expression and Case templates that were generated during
        // the compile phase.
        // --
        // NOTE: This directive has to execute with the priority 999 so that it
        // is linked AFTER the ngRepeat directive is linked (at 1,000).
        return({
            link: link,
            priority: 999,
            require: 'bnRepeatSwitch',
            restrict: 'A'
        });
    }
);
