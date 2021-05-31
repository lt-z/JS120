class Banner {
  constructor(message, width = message.length) {
    this.message = message;
    this.width = width;
  }

  displayBanner() {
    console.log([this.horizontalRule(),
      this.emptyLine(),
      this.messageLine(),
      this.emptyLine(),
      this.horizontalRule()
    ].join("\n"));
  }

  horizontalRule() {
    return `+-${'-'.repeat(this.width)}-+`;
  }

  emptyLine() {
    return `| ${' '.repeat(this.width)} |`;
  }

  messageLine() {
    let regex = new RegExp(`.{0,${this.width}}`, 'g');
    let splitMessage = this.message.match(regex);
    let empty = (this.message.length - this.width) / 2;

    return splitMessage.map(line => {
      return `| ${line.padStart(empty, ' ').padEnd(this.width, ' ')} |`;
    }).join('\n');
  }
}


// Test cases:
let banner1 = new Banner('To boldly go where no one has gone before.', 20);
banner1.displayBanner();
// +--------------------------------------------+
// |                                            |
// | To boldly go where no one has gone before. |
// |                                            |
// +--------------------------------------------+

let banner2 = new Banner('');
banner2.displayBanner();
// +--+
// |  |
// |  |
// |  |
// +--+