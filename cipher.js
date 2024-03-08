const message = "All I 12 ! Shello world";
let stringSpliter = (str, chunkSize) => {
  if (chunkSize <= 0) {
    return ["Invalid chunk size"];
  }

  return result;
};
const moveShift = (message, shifts = 1) => {
  let encodedMessage = "";
  const splittedCipher = [];
  let chunkSize;
  for (let index = 0; index < message.length; index++) {
    let charAscii = message.charCodeAt(index);
    let shiftedAscii;
    if (123 > charAscii && charAscii > 96) {
      shiftedAscii = ((charAscii - 97 + (shifts + index)) % 26) + 97;
    } else if (91 > charAscii && charAscii > 64) {
      shiftedAscii = ((charAscii - 65 + (shifts + index)) % 26) + 65;
    } else {
      shiftedAscii = charAscii;
    }
    encodedMessage = encodedMessage.concat(String.fromCharCode(shiftedAscii));
  }
  chunkSize = Math.ceil(encodedMessage.length / 5);
  console.log(encodedMessage);
  for (let i = 0; i < encodedMessage.length; i += chunkSize) {
    splittedCipher.push(encodedMessage.substring(i, i + chunkSize));
  }
  return splittedCipher;
};
// console.log(message.charCodeAt(0));
// console.log(String.fromCharCode(104));
console.log(moveShift(message, 1));
