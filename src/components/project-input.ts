/// <reference path='base-componenet.ts'/>
/// <reference path='../decorators/autobind.ts'/>
/// <reference path='../util/validation.ts'/>
/// <reference path='../state/project-state.ts'/>

namespace App {
     export class ProjectInput extends Component<
          HTMLDivElement,
          HTMLFormElement
     > {
          titleInputElement: HTMLInputElement;
          descriptionInputElement: HTMLInputElement;
          peopeleInputElement: HTMLInputElement;
          constructor() {
               super("project-input", "app", true, "user-input");
               this.titleInputElement = this.element.querySelector(
                    "#title"
               ) as HTMLInputElement;
               this.descriptionInputElement = this.element.querySelector(
                    "#description"
               ) as HTMLInputElement;
               this.peopeleInputElement = this.element.querySelector(
                    "#people"
               ) as HTMLInputElement;

               // get the data from the dom

               this.configure();
          }
          configure() {
               this.element.addEventListener(
                    "submit",
                    this.submitHandler.bind(this)
               ); // listen to button selection or on click
          }

          renderContent() {}

          private gatherUserInput(): [string, string, number] | void {
               const enteredTitle = this.titleInputElement.value;
               const enteredDescription = this.descriptionInputElement.value;
               const enteredPeopele = this.peopeleInputElement.value;

               const titleValidatable: Validatable = {
                    value: enteredTitle,
                    required: true,
               };
               const descriptionValidatable: Validatable = {
                    value: enteredDescription,
                    required: true,
                    minLength: 5,
               };
               const peopleValidatable: Validatable = {
                    value: +enteredPeopele,
                    required: true,
                    min: 1,
                    max: 5,
               };

               if (
                    !validate(titleValidatable) ||
                    !validate(descriptionValidatable) ||
                    !validate(peopleValidatable)
               ) {
                    alert("Invalid input, please try again!");
                    return;
               } else {
                    return [enteredTitle, enteredDescription, +enteredPeopele];
               }
          }

          private clearInputs() {
               this.titleInputElement.value = "";
               this.descriptionInputElement.value = "";
               this.peopeleInputElement.value = "";
          }
          @autobind
          private submitHandler(event: Event) {
               // take the values of(title,people,number)

               event.preventDefault();
               const userInput = this.gatherUserInput();
               if (Array.isArray(userInput)) {
                    const [title, description, people] = userInput;
                    projectState.addProject(title, description, people);

                    this.clearInputs();
               }
          }
     }
}
