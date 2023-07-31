function Validator(formSelector){
    const formElement = document.querySelector(formSelector);
    var formRules = {};
    var validatorRules = {
        required: function(value){
            return value ? undefined: 'Vui lòng nhập trường này'
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)? undefined: 'Vui lòng nhập đúng định dạng email'
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
            }
        }
    }
  
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        
        for(var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {
                var ruleIsValue =rule.includes(':') ;
                if(ruleIsValue){
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];
                if(ruleIsValue){
                    ruleFunc = ruleFunc(ruleInfo[1])
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }
            input.onblur = handleValidator;
            input.oninput = handleClearError;
        }
        var errorMessage;
        
        function handleValidator(e){
            var rules = formRules[e.target.name];
            var printError = e.target.closest('.form-group').querySelector('.form-message');
            for(var rule of rules) {
                errorMessage = rule(e.target.value);
                if(errorMessage){
                    printError.innerText = errorMessage;
                    e.target.closest('.form-group').classList.add('invalid');
                    break; //cái này giúp cho kiểm tra lỗi bỏ trống trước khi kiểm tra định dạng email
                }
            }
            return !errorMessage
        }

        function handleClearError(e){
            var printError = e.target.closest('.form-group').querySelector('.form-message');
            if(e.target.closest('.form-group').classList.contains('invalid')){
                e.target.closest('.form-group').classList.remove('invalid');
                printError.innerText = '';
            }
        }
        var _this =this;
       // console.log(this)
        formElement.onsubmit = function(e){
            e.preventDefault();
            //Kiểm tra toàn bộ nếu có lỗi in ra
            var isValid = false;
            for(var input of inputs){
                
                if(handleValidator({target: input})){
                    isValid = true;
                }
            }
            var getData ={};
            // console.log(this)
           
            if(isValid){
                console.log("thực hiện in dữ liệu người dùng")
                for(var input of inputs){
                    switch(input.type) {
                        case 'radio': 
                            console.log('fuck you');
                            break;
                        default: 
                            {
                                getData[input.name] = input.value;
                            }
                        }
                        
                        
                    }
                    _this.onSubmit(getData)
            }
        }
    }

}

