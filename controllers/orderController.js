const puppeteer = require('puppeteer');
const emailController = require('./emailController');
const axios = require('axios');

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

exports.place = async (req, res) => {
    let order = req.body;
    console.log(order);
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process']
    });

    // if result is false, it means the product is not in stock, so keep tracking
    let result = false;
    const page = await browser.newPage()
    while(!result){
        console.log(result)
        page.setDefaultTimeout(1000000)
        let url = order.url;
        await page.goto(url)
        sleep(4000);
        result = await page.evaluate(async(order)=>{
            let check = false;
            // let div = document.querySelector('div[class="ProductDetails-form__sizes"]');
            let field = await document.querySelector('fieldset[class="Fieldset c-form-field ProductDetails-form__sizes"]');
            let buttons = await field.querySelectorAll('button');
            // if(field){
                // let buttons = await field.querySelectorAll('span[class="c-form-label-content"]')
                for(let button of buttons){
                    if(button.ariaLabel == "Size: " + order.size){
                    // if(button.textContent == order.size){
                        await button.click();
                        check = true;
                        break;
                    }
                }
            // }
            return check;
        }, order);
    }

    if(result){
        let btn = await page.$('button[name="bluecoreCloseButton"]');
        if(btn){
            await btn.click();
            sleep(2000);
        }
        let submit = await page.$('button[class="Button ProductDetails-form__action"]');
        sleep(3000);
        await submit.click();
        sleep(2000);
        let a = await page.$('a[class="CartCount col Link-underline c-header__icon"]');
        await a.click();
        sleep(4000);
        a = await page.$('a[class="Button Button--alt"]');
        sleep(2000);
        let user = await axios.get(`http://localhost:4000/user/${order.username}`);
        let check = true;
        for(let key in user){
            if(user[key] == ''){
                check = false;
                emailController.fillForm(user.username);
                res.send("fill")
            }
        }

        if(check){
            await page.type('input[name="firstName"]', user.first, {delay: 10});
            await page.type('input[name="lastName"]', user.last, {delay: 10});
            await page.type('input[name="email"]', user.email, {delay: 10});
            await page.type('input[name="phone"]', user.telephone, {delay: 10});
            let btn = await page.$('button[class="Button"]');
            sleep(1000)
            await btn.click();
            sleep(2000);

            await page.type('input[name="firstName"]', user.first, {delay: 10});
            await page.type('input[name="lastName"]', user.last, {delay: 10});
            await page.type('input[name="line1"]', user.street, {delay: 10});
            await page.type('input[name="line2"]', user.apt, {delay: 10});
            await page.type('input[name="postalCode"]', user.zip, {delay: 10});
            await page.type('input[name="town"]', user.city, {delay: 10});
            await page.type('select[name="region"]', user.state, {delay: 10});
            btn = await page.$('button[class="Button"]');
            sleep(1000)
            await btn.click();
            sleep(2000);

            let form = await page.$('form[class="AddressVerification-form c-form Form gutterV-0"]');
            if(form){
                btn = await page.$('button[class="Button"]');
                sleep(1000)
                await btn.click();
                sleep(2000);
            }

            await page.type('input[id="encryptedCardNumber"]', user.card_number, {delay: 10});
            let parts = order.expiry.split("/")
            let mon = parts[0];
            let year = parts[1];
            await page.type('input[id="encryptedExpiryMonth"]', mon, {delay: 10});
            await page.type('input[id="encryptedExpiryYear"]', year, {delay: 10});
            await page.type('input[id="encryptedSecurityCode"]', user.cvc, {delay: 10});
            sleep(3000)

            btn = await page.$('button[class="Button"]');
            sleep(1000)
            await btn.click();
            sleep(2000);

            //done
            btn = await page.$('button[class="Button"]');
            sleep(1000)
            await btn.click();
            sleep(2000);
            emailController.solvePuzzle(user.username);
            res.send("puzzle");
        }
    }else{
        res.send("failed")
    }
    // let field = await page.$('fieldset[class="Fieldset c-form-field ProductDetails-form__sizes"]');
    // if(field){
    //     let buttons = await field.$$('button');
    //     for(let button of buttons){
    //         console.log(button.disabled)
    //         await button.click();
    //         if(button["ariaLabel"] == "Size: " + order.size){
    //             console.log("here")
    //         }
    //     }
    // }else{
    //     res.send("failed")
    // }
}