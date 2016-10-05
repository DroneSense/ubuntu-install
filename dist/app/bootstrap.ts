import dsApp from './app';

angular.element(document).ready( (): void => {
  angular.bootstrap(document, [dsApp.name], { strictDi: true });
});
