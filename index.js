const querystring = require('querystring');
const axios = require('axios')


const auth = Buffer.from('BankinClientId:secret', 'utf8').toString('base64');


async function main() {

    const refresh_token = await axios.post (
        'http://localhost:3000/login',
        {
            user: 'BankinUser',
            password: '12345678'
        },
        {
            headers: {
                'Authorization': "Basic "+auth
            }
        }
    ).then(function (res) {
        return res.data["refresh_token"]
    }).catch(function (error) {
        console.log(error);
    });

    console.log(refresh_token)



    const access_token = await axios.post('http://localhost:3000/token', querystring.stringify({grant_type: "refresh_token", refresh_token:refresh_token}))
    .then(function (res) {
        return res.data["access_token"]
    }).catch(function (error) {
        console.log(error);
    });

    console.log(access_token)
    

    const account_list = await axios.get (
        'http://localhost:3000/accounts',
        {
            headers: {
                'Authorization': "Bearer "+access_token
            }
        }
    ).then(function (res) {
        return res.data["account"]
    }).catch(function (error) {
        console.log(error);
    });

    
    for(i in account_list) {
        console.log(account_list[i])
        const transactions_list = await axios.get (
            'http://localhost:3000/accounts/'+account_list[i]["acc_number"]+'/transactions',
            {
                headers: {
                    'Authorization': "Bearer "+access_token
                }
            }
            ).then(function (res) {
                console.log(res.data["transactions"])
            })
            .catch(function (error) {
                console.log(error);
        });
    }
}

main()