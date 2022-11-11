/**
 * Returns html that is stripped to certain character length
 * @param {string} src html content to be stripped
 * @param {number} length max length
 * @param {bool|string=} suffix append dots (or provided string) at the end
 * @returns {string} stripped html
 */
function html_substr(src, length, suffix){
  if(length >= src.length) return src;
  var str = "", //final content
      i = 0, //position in source
      tag = '', //current tag contents (used during content reading)
      c = '', //current char (used during content reading)
      end = 0, //ending position of tag (used during content reading)
      len = src.length, //lenght of the source
      cnt = 0, //content size
      tagTree = [], //open tags

      /**
       * Strips parameters and <> from tag
       * @param {string} content full tag content (ex.: <span a="b">)
       * @returns {string} tag name (ex.: span)
       */
      tagStrip = function(content){
        var index = tag.indexOf(" "); //check for space (ex.: <span a="b">)
        if(index == -1) { //no space (ex.: <span>)
          return content.slice(1,-1);
        }
        return content.slice(1,index);
      };

  //Go trough the content until we read enough of it
  while(cnt < length && i < len) {
    c = src.charAt(i); //Read next char
    if(c == '<') {
      //Tag found
      end = src.slice(i).indexOf(">");
      if(end == -1) { //Check for incomplete tag
        return str;
      }
      end += i + 1;
      tag = src.slice(i,end); //Read tag contents
      str += tag; //Append the tag to final content
      if(tag.charAt(1) == "/") {
        //Closing tag
        tagTree = tagTree.slice(0,-1);
      } else {
        //New tag
        tagTree.push(tagStrip(tag));
      }
      i = end; //Move the position to end of the tag

    } else {
      //Append content character and move the position
      str += c;
      i++;
      cnt++;
    }
  }
  //Go trough all open tags and close them
  if(tagTree.length > 0) {
    for(i = tagTree.length - 1;i>=0;i--) {
      str += "</" + tagTree[i] + ">";
    }
  }
  //Return final cutted content and put suffix after it
  if(suffix === false) return str;
  return str + ((typeof suffix == "undefined" || suffix === true) ? "..." : suffix);
}
if (module && module.exports) {
  module.exports = html_substr;
}
