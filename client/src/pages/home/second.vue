<template>
    <div>
        <table>
            <tr v-for="(row, index) in table" :key="index">
                <td>{{row.a}}</td>
                <td>{{row.b}}</td>
                <td>{{row.c}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
  const table = new Array(1000);
  for (let i = 0; i < table.length;i++){
    table[i] = {a:1,b:2,c:3}
  }
//  setInterval(() => {
//    for (let i = 0;i<50;i++ ) {
//      table[i].a++
//      table[i].b++
//      table[i].c++
//    }
//  }, 100)
    export default {
      data() {
        return {
          table
        }
      }
    }
</script>
