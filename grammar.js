// 大文字小文字を区別しないキーワードマッチ用関数
function caseInsensitive(keyword) {
  return new RegExp(
    keyword
      .split("")
      .map((letter) => `[${letter.toLowerCase()}${letter.toUpperCase()}]`)
      .join(""),
  );
}

export default grammar({
  name: "twn",

  extras: ($) => [/\s/],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) =>
      choice(
        $.comment,
        $.label_definition,
        $.instruction,
        $.syscall_arg, // 数値などを単独で書く場合用
      ),

    // コメント: ; から行末まで
    comment: ($) => /;[^\n]*/,

    // ラベル定義: 文字列 + :
    label_definition: ($) => seq($.identifier, ":"),

    // 命令
    instruction: ($) =>
      choice(
        // 引数なし命令
        $.opcode_no_arg,
        // 引数あり命令 (PUSH 10, ADDI 5 など)
        seq($.opcode_with_arg, $.argument),
        // ジャンプ系 (JZ Loop など)
        seq($.opcode_jump, $.argument),
      ),

    // 引数 (数値 または ラベル参照)
    argument: ($) => choice($.number, $.identifier),

    syscall_arg: ($) => $.argument,

    // オペコード定義 (大文字小文字区別なし)
    opcode_no_arg: ($) =>
      choice(
        caseInsensitive("SYSCALL"),
        caseInsensitive("POP"),
        caseInsensitive("DUP"),
        caseInsensitive("SWAP"),
        caseInsensitive("ADD"),
        caseInsensitive("SUB"),
        caseInsensitive("MUL"),
        caseInsensitive("DIV"),
        caseInsensitive("MOD"),
        caseInsensitive("RET"),
        caseInsensitive("FIN"),
        caseInsensitive("STORE"), // STORE/LOADはスタック操作なので引数なし扱いも可能だが、文脈による
        caseInsensitive("LOAD"),
      ),

    opcode_with_arg: ($) =>
      choice(
        caseInsensitive("PUSH"),
        caseInsensitive("ADDI"),
        caseInsensitive("SUBI"),
        caseInsensitive("MULI"),
        caseInsensitive("DIVI"),
        caseInsensitive("MODI"),
        caseInsensitive("STOREI"),
        caseInsensitive("LOADI"),
      ),

    opcode_jump: ($) =>
      choice(
        caseInsensitive("JZ"),
        caseInsensitive("JMZ"),
        caseInsensitive("CALL"),
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: ($) =>
      choice(
        /\d+/, // 10進数
        /0[xX][0-9a-fA-F]+/, // 16進数
      ),
  },
});
