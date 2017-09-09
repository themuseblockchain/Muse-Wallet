var express = require('express');
var router = express.Router();
var muse = require('museblockchain-js');

var reCAPTCHA = require('recaptcha2')

var localFaucetConfig = require('../../config.private.json');
var localConfig = require('../../config.json');

var recaptcha = null;
if(localFaucetConfig['recaptcha-site-key'])
{
  recaptcha = new reCAPTCHA({
    siteKey: localFaucetConfig['recaptcha-site-key'],
    secretKey: localFaucetConfig['recaptcha-secret']
  });
}


muse.configureFaucet(localFaucetConfig);
muse.configure(localConfig);

var defaultHistoryFormatter = function(userName, operationName, date, operationData, additionnal)
{
  var history_info = { name: operationName, date: date, raw: operationData };
  switch(operationName)
  {
    case "account_create":
      if(operationData.creator == userName)
      {
        history_info.text = 'Created Account ' + operationData.new_account_name;
      }
      else if(operationData.new_account_name == userName)
      {
        history_info.text = 'Account Creation';
      }
      break;
    case "transfer":
      if(operationData.to == userName)
      {
        history_info.text = 'Received ' + operationData.amount + ' MUSE from ' + operationData.from;
      }
      else
      {
        history_info.text = 'Sent ' + operationData.amount + 'MUSE to ' + operationData.to;
      }
      break;
    case "transfer":
      if(operationData.to == userName)
      {
        history_info.text = 'Received ' + operationData.amount + ' MUSE from ' + operationData.from;
      }
      else
      {
        history_info.text = 'Sent ' + operationData.amount + 'MUSE to ' + operationData.to;
      }
      break;

    case "transfer_to_vesting":
      if(operationData.to == userName)
    {
        history_info.text = 'Received ' + operationData.amount + ' VEST from ' + operationData.from;
      }
      else
      {
        history_info.text = 'Sent ' + operationData.amount + 'VEST to ' + operationData.to;
      }
      break;
    default: 
      history_info.text = "Unknow operation: " + operationName;
  }

  return history_info;
};

var base_display = function(type, req, res, next)
{
  /*if(req.app.get('env') != 'development')
  {
    var err = new Error('Not in development mode');
    err.status = 401;
    next(err);  
  }
  else*/
  {
    var viewbag = { title: 'MUSE Test Application',
                        srv_url: muse.config.get('websocket'),
                        addr_prefix: muse.config.get('address_prefix'),
                        chain_id: muse.config.get('chain_id'),
                        view_type: type,
                        generatedCaptcha: (recaptcha ? recaptcha.formElement() : "")
                      };


        var doRender = function()
        {
          res.render('index', viewbag);
        };

        if(type == 'accounts')
        {
          muse.api.getActiveWitnesses(function(err, result) {
          //muse.api.getWitnessesByVote("", 20, function(err, result) {
            viewbag.witnesses = result.length;
            muse.api.getOrderBookForAsset("2.28.2", 500, function(err, result) {
              // limit <= 1000?
              muse.api.getOrderBook(500, function(err, result) {
                  viewbag.order_book_bids = result.bids;
                  viewbag.order_book_asks = result.asks;
                  muse.api.lookupAccounts('', 2000, function(err, result) {
                  viewbag.accounts = result;
                  doRender();
                });
              });
            });
          });
        }
        else if(type == "import_balance")
        {
          muse.claimBalance(req.body.account, req.body.import_key, function(code, message)
          {
            viewbag.import_balance_state = code == 1 ? 1 : -1;
            doRender();
          }); 
        }
        else if(type == 'account')
        {
          /**
           *  Account operations have sequence numbers from 0 to N where N is the most recent operation. This method
           *  returns operations in the range [from-limit, from]
           *
           *  @param account - account whose history will be returned
           *  @param from - the absolute sequence number, -1 means most recent, limit is the number of operations before from.
           *  @param limit - the maximum number of items that can be queried (0 to 1000], must be less than from
           */
          muse.accountHistory(req.query.name, null, 1000, defaultHistoryFormatter, function(code, message, result)
          {
            viewbag.account_history = result;
            muse.accountInfo(req.query.name, function(code, message, data)
            {
              viewbag.account_info = data;
              viewbag.account_info_raw = JSON.stringify(data);
              doRender();
              /*muse.api.getAccountFromId(data.id, function(err, result) { // DUmmy, just to prove call works...
                doRender();
              });*/
            });
          });
        }
        else if(type == 'generate_keys')
        {
          viewbag.name = req.body.name;
          viewbag.password = req.body.password;  

          var keys_to_use = muse.auth.getPrivateKeys(viewbag.name, viewbag.password, ["owner", "active", "basic", "memo"]);
          viewbag.generated_keys = keys_to_use;
          viewbag.generated_keys_raw = JSON.stringify(keys_to_use);

          doRender();
        }
        else if(type == 'account_login')
        {
          viewbag.username = req.body.username;
          viewbag.password = req.body.password;  
          muse.login(viewbag.username, viewbag.password, function(code, message)
          {
            viewbag.account_login_state = code == 1 ? 1 : -1;
            doRender();
          });
        }
        else if(type == 'account_create')
        {

          viewbag.new_name = req.body.new_name;
          viewbag.new_password = req.body.new_password;
          muse.createAccount(viewbag.new_name, viewbag.new_password, function(code, message, result)
          {
            if(code != 0)
            {
              viewbag.account_creation_state = -1;
              viewbag.error_info = message;
            }
            else
            {
              viewbag.account_creation_state = 1;
              viewbag.success_info = message; 
            }  
            doRender();  
          });
        }
        else if(type == 'account_update')
        {
          viewbag.private_wif = req.body.private_wif;
          viewbag.account = req.body.account;
          viewbag.owner = req.body.owner;
          viewbag.active = req.body.active;
          viewbag.basic = req.body.basic;
          viewbag.memo_key = req.body.memo_key;

          var keys_to_use = { ownerPubkey: viewbag.owner, activePubkey: viewbag.active, basicPubkey: viewbag.basic, memoPubkey: viewbag.memo_key }
          muse.broadcast.accountUpdate(
            viewbag.private_wif,
            viewbag.account, 
            /*{
              "weight_threshold": 1,
              "account_auths": [],
              "key_auths": [[keys_to_use.ownerPubkey,1]]
            }*/undefined,
            {
              "weight_threshold": 1,
              "account_auths": [],
              "key_auths": [[keys_to_use.activePubkey,1]]
            },
            {
              "weight_threshold": 0,
              "account_auths": [],
              "key_auths": [[keys_to_use.basicPubkey,1]]
            }, keys_to_use.memoPubkey, {}, function(err, result) {
              if(err)
              {
                viewbag.account_update_state = -1;
                viewbag.error_info = JSON.stringify(err);
              }
              else
              {
                viewbag.account_update_state = 1;
                viewbag.success_info = JSON.stringify(result); 
              }
              doRender();  
          });
        }
        else if(type == 'transfer_funds')
        {
          viewbag.private_wif = req.body.private_wif;
          viewbag.from = req.body.from;
          viewbag.to = req.body.to;
          viewbag.amount = req.body.amount;

          muse.transferFunds(viewbag.from, viewbag.private_wif, viewbag.to, viewbag.amount, null, function(code, message)
          {
            fund_transfer_state = code == 1 ? 1 : -1;
            doRender();
          });
        }
        else if(type == 'transfer_vesting')
        {
          viewbag.private_wif = req.body.private_wif;
          viewbag.from = req.body.from;
          viewbag.to = req.body.to;
          viewbag.amount = req.body.amount;

          muse.transferFundsToVestings(viewbag.from, viewbag.private_wif, viewbag.to, viewbag.amount, function(code, message)
          {
            fund_transfer_state = code == 1 ? 1 : -1;
            doRender();
          });
        }
        else if(type == 'withdraw_vesting')
        {
          viewbag.private_wif = req.body.private_wif;
          viewbag.from = req.body.from;
          viewbag.amount = req.body.amount;

          muse.withdrawVesting(viewbag.from, viewbag.private_wif, viewbag.amount, function(code, message) {
            fund_transfer_state = code == 1 ? 1 : -1;
            doRender();
          });
        }
        else if(type == 'witness_vote')
        {
          viewbag.private_wif = req.body.private_wif;
          viewbag.account = req.body.account;
          viewbag.witness = req.body.witness;
          viewbag.approve = req.body.approve;

          muse.broadcast.accountWitnessVote(viewbag.account, viewbag.witness, viewbag.approve == 1, function(err, result) {
            debugger;
            witness_vote_state = err == null ? 1 : -1;
            doRender();
          });
        }
        else
        {
          doRender();
        }
    }
};

var recaptchaMiddleware = function (req, res, next) {
  if(recaptcha)
  {
    recaptcha.validateRequest(req)
    .then(function(){
      // valid and secure
      next();
    })
    .catch(function(errorCodes){
      // invalid
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ code: -10, message: "Problem with captcha" }));
      //res.json({formSubmit:false,errors:recaptcha.translateErrors(errorCodes)});
    });
  }
  else
  {
    next(); 
  }
}

router.post('/validate_email'/*, recaptchaMiddleware*/, function(req, res, next) {

  // Fix CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  // would be a nice spot to assign funds, etc
  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ code: 1, message: 'Success', token: 'DUMMY_TOKEN' }));
});

router.get('/confirm_email'/*, recaptchaMiddleware*/, function(req, res, next) {

  // Fix CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  res.redirect(302, localFaucetConfig['signup-redirect-address']);
});

router.post('/validate_phone'/*, recaptchaMiddleware*/, function(req, res, next) {

  // Fix CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  // would be a nice spot to assign funds, etc
  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ code: 1, message: 'Success' }));
});

router.post('/confirm_phone'/*, recaptchaMiddleware*/, function(req, res, next) {

  // Fix CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  // would be a nice spot to assign funds, etc
  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ code: 1, message: 'Success' }));
});

router.post('/create_account'/*, recaptchaMiddleware*/, function(req, res, next) {

  // Fix CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  //handle req.body.token
  //ensure we have the right to do this
  muse.createAccountWithKeys(req.body.account_name, req.body.owner_pub_key, req.body.active_pub_key, req.body.basic_pub_key, req.body.memo_pub_key, function(code, message)
  {
    // would be a nice spot to assign funds, etc
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ code: code, message: message }));
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  base_display('root', req, res, next)
});

router.get('/account', function(req, res, next) {
  base_display('account', req, res, next)
});

router.get('/get_import_balance', function(req, res, next) {
  base_display('get_import_balance', req, res, next)
});

router.get('/accounts', function(req, res, next) {
  base_display('accounts', req, res, next)
});

router.post('/account_create', recaptchaMiddleware, function(req, res, next) {
  base_display('account_create', req, res, next)
});

router.post('/import_balance', function(req, res, next) {
  base_display('import_balance', req, res, next)
});

router.post('/account_update', function(req, res, next) {
  base_display('account_update', req, res, next)
});

router.post('/account_login', function(req, res, next) {
  base_display('account_login', req, res, next)
});

router.post('/transfer_funds', function(req, res, next) {
  base_display('transfer_funds', req, res, next)
});

router.post('/transfer_vesting', function(req, res, next) {
  base_display('transfer_vesting', req, res, next)
});

router.post('/withdraw_vesting', function(req, res, next) {
  base_display('withdraw_vesting', req, res, next)
});

router.post('/witness_vote', function(req, res, next) {
  base_display('witness_vote', req, res, next)
});

router.post('/generate_keys', function(req, res, next) {
  base_display('generate_keys', req, res, next)
});

router.post('/witness_update', function(req, res, next) {
  base_display('witness_update', req, res, next)
});


module.exports = router;
