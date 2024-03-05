// Code goes here!

//autbind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
     const orginalMethod = descriptor.value;
     const adjDescriptor: PropertyDescriptor = {
          configurable: true,
          get() {
               {
                    const boundFn = orginalMethod.bind(this);
                    return boundFn;
               }
          },
     };

     return adjDescriptor;
}

//project class
class ProjectInput {
     templateElement: HTMLTemplateElement; // main templet
     hostElement: HTMLDivElement; // select the div
     element: HTMLFormElement; // select the form

     titleInputElement: HTMLInputElement;
     descriptionInputElement: HTMLInputElement;
     peopeleInputElement: HTMLInputElement;
     constructor() {
          this.templateElement = document.getElementById(
               "project-input"
          )! as HTMLTemplateElement;
          this.hostElement = document.getElementById("app")! as HTMLDivElement; // put the app
          const importedNode = document.importNode(
               this.templateElement.content,
               true
          );

          this.element = importedNode.firstElementChild as HTMLFormElement;
          this.element.id = "user-input"; // set the css to the form

          // get the data from the dom
          this.titleInputElement = this.element.querySelector(
               "#title"
          ) as HTMLInputElement;
          this.descriptionInputElement = this.element.querySelector(
               "#description"
          ) as HTMLInputElement;
          this.peopeleInputElement = this.element.querySelector(
               "#people"
          ) as HTMLInputElement;

          this.configure();
          this.attach(); // attach the form
     }

     private attach() {
          // attach the templet on the DOM
          this.hostElement.insertAdjacentElement("afterbegin", this.element);
     }

     private gatherUserInput(): [string, string, number] | void {
          const enteredTitle = this.titleInputElement.value;
          const enteredDescription = this.descriptionInputElement.value;
          const enteredPeopele = this.peopeleInputElement.value;

          if (
               enteredDescription.trim().length === 0 ||
               enteredDescription.trim().length === 0 ||
               enteredDescription.trim().length === 0
          ) {
               alert("Invalid input,plaeas try again");
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
               // const [title, description, people] = userInput;
               this.clearInputs();
               // console.log(title, description, people);
          }
     }

     private configure() {
          this.element.addEventListener(
               "submit",
               this.submitHandler.bind(this)
          ); // listen to button selection or on click
     }
}

const porjectInput = new ProjectInput();
