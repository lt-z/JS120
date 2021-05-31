/* eslint-disable max-lines-per-function */
function createStudent(name, year) {
  return {
    name,
    year,
    courses: {},

    info() {
      console.log(`${this.name} is a ${this.year} year student.`);
    },

    listCourses() {
      console.log(Object.keys(this.courses)
        .map(course => this.courses[course]));
    },

    addCourse(course) {
      this.courses[course.code] = course;
    },

    addNote(code, note) {
      let course = this.courses.hasOwnProperty(code);
      if (course) {
        if (!this.courses[code].notes) {
          this.courses[code].notes = [note];
        } else {
          this.courses[code].notes.push(note);
        }
      }
    },

    updateNote(code, note) {
      this.courses[code].notes = [note];
    },

    viewNotes() {
      Object.keys(this.courses).filter(course => this.courses[course].hasOwnProperty('notes'))
        .forEach(course => {
          console.log(`${this.courses[course].name}: ${this.courses[course].notes.join('; ')}`);
        });
    }
  };
}

let foo = createStudent('Foo', '1st');
foo.info();
// "Foo is a 1st year student"
foo.listCourses();
// [];
foo.addCourse({ name: 'Math', code: 101 });
foo.addCourse({ name: 'Advanced Math', code: 102 });
foo.listCourses();
// [{ name: 'Math', code: 101 }, { name: 'Advanced Math', code: 102 }]
foo.addNote(101, 'Fun course');
foo.addNote(101, 'Remember to study for algebra');
foo.viewNotes();
// "Math: Fun course; Remember to study for algebra"
foo.addNote(102, 'Difficult subject');
foo.viewNotes();
// "Math: Fun course; Remember to study for algebra"
// "Advance Math: Difficult subject"
foo.updateNote(101, 'Fun course');
foo.viewNotes();
// "Math: Fun course"
// "Advanced Math: Difficult subject"

foo.addNote(104, 'No such course');
foo.viewNotes();
