# TrackIT

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## My comments

As far as I know using the cli has problems because there are 2 module file: app.module.ts and app.server.module.ts.
To make the cli command work you have to specify the app.module.ts as the module file like this:

    ng generate component componentName --module=app.module   (or ng g c componentName --module=app.module)

This is caused since the generation tried to add your component to a module, i.e. to add this line

  import { MyComponent } from './Components/my-component/my-component.component';

but it found 2 modules.
