/* eslint-disable max-lines-per-function */
function createStudent(name, year) {
  return {
    name: name,
    year: year,
    courses: [],
    info: function() {
      console.log(`${this.name} is a ${this.year} year student`);
    },

    listCourses: function() {
      return this.courses;
    },

    addCourse: function(course) {
      this.courses.push(course);
    },

    addNote: function(courseCode, note) {
      let course = this.courses.filter(course => {
        return course.code === courseCode;
      })[0];

      if (course) {
        if (course.note) {
          course.note += `; ${note}`;
        } else {
          course.note = note;
        }
      }

    },

    viewNotes: function() {
      this.courses.forEach(course => {
        if (course.note) {
          console.log(`${course.name}: ${course.note}`);
        }
      });
    },

    updateNote: function(courseCode, note) {
      let course = this.courses.filter(course => {
        return course.code === courseCode;
      })[0];

      if (course) {
        course.note = note;
      }
    },
  };
}

let school = {
  students: [],

  addStudent: function(name, year) {
    if (['1st', '2nd', '3rd', '4th', '5th'].includes(year)) {
      let student = createStudent(name, year);
      this.students.push(student);
      return student;
    } else {
      console.log('Invalid Year');
    }
  },

  enrollStudent: function(student, courseName, courseCode) {
    student.addCourse({name: courseName, code: courseCode});
  },

  addGrade: function(student, courseName, grade) {
    let course = student.listCourses()
      .filter(course => course.name === courseName)[0];
    if (course) {
      course.grade = grade;
    }
  },

  getReportCard: function(student) {
    student.listCourses().forEach(course => {
      if (course.hasOwnProperty('grade')) {
        console.log(`${course.name}: ${course.grade}`);
      } else {
        console.log(`${course.name}: In progress`);
      }
    });
  },

  courseReport: function(courseName) {
    console.log(`=${courseName} Grades=`);
    let average = 0;
    let count = 0;

    this.students.forEach(student => {
      student.courses.forEach(course => {
        if (course.name === courseName) {
          console.log(`${student.name}: ${course.grade}`);
          average += course.grade;
          count += 1;
        }
      });
    });
    console.log('---');
    console.log(`Course Average: ${average / count}`);
  }
};

let foo = school.addStudent('foo', '3rd');
school.enrollStudent(foo, 'Math', 101);
school.enrollStudent(foo, 'Advanced Math', 102);
school.enrollStudent(foo, 'Physics', 202);

school.addGrade(foo, 'Math', 95);
school.addGrade(foo, 'Advanced Math', 90);

school.getReportCard(foo);

let bar = school.addStudent('bar', '1st');
school.enrollStudent(bar, 'Math', 101);

school.addGrade(bar, 'Math', 91);

let qux = school.addStudent('qux', '2nd');
school.enrollStudent(qux, 'Math', 101);
school.enrollStudent(qux, 'Advanced Math', 102);

school.addGrade(qux, 'Math', 93);
school.addGrade(qux, 'Advanced Math', 90);

school.courseReport('Math');

school.getReportCard(qux);

