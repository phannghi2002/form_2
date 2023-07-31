function Validator(formSelector) {
    var _this =this;
    var formRules = {};

    var formElement = document.querySelector(formSelector);
   
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng định dạng email';
        },
        min: function (min) {
            return lele = function (value) {
                return value.length >= min ? undefined : 'Vui lòng nhập ít nhất ' + min + ' ký tự';
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : 'Vui lòng nhập tối đa' + max + 'ký tự';
            }
        }
    }

    if (formElement) {
        var inputs = formElement.querySelectorAll("[name][rules]");
        // console.log(inputs)
        for (var input of inputs) {

            var rules = input.getAttribute("rules").split("|");
//phải dùng getAttrbute vì đây ko phải là thuộc tính có sẵn mà nó là do ta tự thêm vào
//console.log(rules) ta thấy rules là một chuỗi vì thế có thể dùng hàm split ->sau khi
//dùng hàm split thì nó sẽ trở thành dạng mảng => rules thành mảng


            for (var rule of rules) {

                var rulesInfo;
                var isRuleHasValue = rule.includes(":");

                if (isRuleHasValue) {
                    ruleInfo = rule.split(":");
                    rule = ruleInfo[0];

                    //console.log(validatorRules[rule](ruleInfo[1]));
                }

                var ruleFunc = validatorRules[rule];
                
//validatorRules là một object vì thế để lấy giá trị của hàm require hay min hay email
//ta dùng [rule]
               
                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
//vì ruleFunc nó sẽ trả về một hàm nên khi ta muốn gọi đến hàm bên trong nó ta cần truyền vào cho
//nó một giá trị 
                }
                
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc]; 
                }
                
            }

            //Lắng nghe sự kiện để validate(blur, input,change...)

            input.onblur = handleValidate;
//khi gọi hàm này thì ta ko cần gọi trực tiếp đến hàm mà chỉ cần gọi thế này là được, nghĩa là không cần dấu ngoặc
            input.oninput = handleClearError;

        }
        
        var errorMessage;
        

        function handleValidate(event) {
            var rules = formRules[event.target.name];
// console.log(event.target.name)ta có thể lấy lần lượt ra các key name như email, fullname, password
//như vậy để lấy ra các hàm tương ứng của nó thì ta xem mấy cái key kia chính là key trong object của
//formRules để lấy ta hàm rồi truyền giá trị vào mà kiểm tra. rules chính là các hàm tương ứng với từng 
//key cảu object formRules: console.log(rules)

            for(var rule of rules) {
                errorMessage = rule(event.target.value);
                //đoạn này dùng để kiểm tra giá trị,bởi vì rule này là tương ứng với 1 hàm, và cần 
                //truyền vào giá trị để nó kiểm tra.
                if(errorMessage) break;
//nếu errorMessage mà là undefine thì vòng lặp vẫn chạy
            }
            
            var elementError = event.target.closest('.form-group');
            var formMessage = elementError.querySelector('.form-message');

            if (errorMessage) {
                formMessage.innerText = errorMessage;
                elementError.classList.add('invalid');
            }
//nếu errorMessage mà là undefine thì ko thực hiện câu lệnh if này, vì thế lỗi ko được in ra,
//còn nếu errorMessage mà là 'vui lòng nhập trường này..' ->chuỗi khác rỗng => sẽ là true 
//trong câu lệnh if =>thực hiện câu lệnh in ra màn hình
            return !errorMessage;
//!phủ định lại, nếu undefined => false =>!errorMessage là true, ngược lại
//nếu có lỗi thì !errorMessage là false.
        }

        function handleClearError(event) {
            var elementError = event.target.closest('.form-group');
            if (elementError.classList.contains('invalid')) {
                elementError.classList.remove('invalid');
                var formMessage = elementError.querySelector('.form-message');
                formMessage.innerText = '';
            }
        }
    }

    formElement.onsubmit = function (event) {
        event.preventDefault();
        var inputs = formElement.querySelectorAll("[name][rules]");
        var isValid = true;
//hàm này dùng để in toàn bộ lỗi nếu ấn submit
        for (var input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
//nếu có ko có lỗi thì !handleValidate sẽ thành false và ko thực hiện câu lệnh if
            }
           
          // handleValidate({ target: input });
/* handlerValidate(event) giống với handlerValidate({ target:input })
Vì thế nên event = { target:input }, object này có: key: target,
value: input.
Cách lấy ra value của 1 object sẽ là: object.key = value
từ đây thay thế:
object = event
key = target
value = input

=> event.target=input

giống như biến rules được khai báo ở hàm handleValidate(event) ban đầu
let rules = formRules[event.target.name];....mục tiêu của ta là chỉ cần 
event.target còn name hay value hay closest đều có trong input cả rồi 
có thể thử  console.log(input.value), console.log(input.name)*/

        }
        //Khi không có lỗi thì submit form
        if (isValid) {
            if (typeof _this.onSubmit === 'function') {

                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
//SelectorAll sẽ trả về một NodeList vì vậy ta cần chuyển nó về dạng mảng
                console.log(Array.from(enableInputs));
                var formValues = Array.from(enableInputs).reduce((values, input1) =>{

                    switch (input1.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'checkbox':
                            if (!values[input.name]) {
                                values[input.name] = '';
                            }

                            if (!input.matches(':checked')) {
                                return values;
                            }

                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input1.name] = input1.value;
//Trong thẻ chứa select nó sẽ lọt vào đây tại vì select ko hỗ trợ type nên nó sẽ trả về undefined.
//Chú ý select ko phải là input mà ta lấy nó dựa vào [name] chứ ko phải lấy tất cả thẻ input để làm việc
                    }

                    return values;
                }, {});
//gọi lại hàm onSubmit và trả về kèm giá trị
               _this.onSubmit(formValues);
            }

            else {
                formElement.submit();
            }
        }
    }
}