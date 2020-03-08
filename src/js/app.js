App = 
{
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    //App.generate()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const tendering = await $.getJSON('tender.json')
    App.contracts.tender = TruffleContract(tendering)
    App.contracts.tender.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.tendering = await App.contracts.tender.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },


contractorRegistration: async() =>{
var id = document.getElementById("contId").value;
var name = document.getElementById("contName").value;

var v = await App.tendering.Contractor(id)
//contractInstance.giveRightToVote(r, {from: web3.eth.accounts[0]});
if(v[0]==id)
{
  alert("Already registered");
}
else
{
await App.tendering.registerContractor(id,name);
window.location.replace("http://localhost:3000/process.html");
/*window.location.replace("http://localhost:3000/FarmerDashboard.html");
var account = web3.currentProvider.selectedAddress;
var f= await App.croping.farmerids(account);
alert(f[0])
document.getElementById("ID").appendChild(f[0]);*/
}

 },



customerRegistration: async() =>{
var id = document.getElementById("customerId").value;
var name = document.getElementById("customerName").value;
var locate = document.getElementById("location").value;
var contact = document.getElementById("phone").value;

var v = await App.croping.customers(id)
//contractInstance.giveRightToVote(r, {from: web3.eth.accounts[0]});
if(v[0]==id)
{
  alert("Already registered");
}
else
{
await App.croping.registerCustomer(id,name,locate,contact);
window.location.replace('http://localhost:3000/CustomerDashboard.html');
}
 },


tender_insert: async() =>{
  //alert("hii");
//var id = document.getElementById("customerId").value;
//var name = document.getElementById("cname").value;
//var loc = document.getElementById("location").value;
//var a_id = document.getElementById("uid").value;
var pro_name = document.getElementById("pname").value;
var sup_name= document.getElementById("sname").value;
var budget =document.getElementById("amount").value;
//alert(pro_name,sup_name,budget);
await App.tendering.insertTender(pro_name,sup_name,budget);
 },

 disburse_bill: async() =>{
  //alert("hii");
//var id = document.getElementById("customerId").value;
//var name = document.getElementById("cname").value;
//var loc = document.getElementById("location").value;
//var a_id = document.getElementById("uid").value;
var cid = document.getElementById("cid").value;
var utr= document.getElementById("utr").value;
var suid =document.getElementById("suid").value;
//alert(pro_name,sup_name,budget);
await App.tendering.funds_usage(cid,utr,suid);
 },

checkContractor: async()=>{
  console.log(App.tendering);
  var account = web3.currentProvider.selectedAddress;
  var f= await App.tendering.contractorids(account);
  console.log(f);
  if(f==0)
  {
    window.location.replace("http://localhost:3000/contractorRegistration.html");
  }
  else
  {
    window.location.replace("http://localhost:3000/contractordashboard.html");
  }
},
getrequested: async()=>{

 console.log(App.tendering);
 App.tendering.idc().then(res=>{
  console.log(res.c[0]);
  let lc=res.c[0];
  
  let a=document.getElementById('allcontracts');
  for(var i = 1;i<a.rows.length;){
            a.deleteRow(i);
        }
  for(var i=1;i<=lc;i++){
    App.tendering.Req_Con(i).then(res2=>{
      console.log(res2);
  if(res2[5].c[0]==0){
  var row = a.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  var cell4=row.insertCell(3);
  cell1.innerHTML = res2[2];
  cell2.innerHTML = res2[4].c[0];
  cell3.innerHTML =res2[1].c[0];
  cell4.innerHTML='<input type=submit value="approve" onclick="App.approve('+res2[0].c[0]+');return false;" class="acceptreject green">'+'<button onclick="App.reject('+res2[0].c[0]+');return false;" class="acceptreject red">'+"Reject"+'</button>';
  }
      })
    }
 

});
      
},
getmy: async()=>{

 console.log(App.tendering);
 App.tendering.idc().then(res=>{
  console.log(res.c[0]);
  let lc=res.c[0];
  
  let a=document.getElementById('mycontracts');

  for(var i=1;i<=lc;i++){
    App.tendering.Req_Con(i).then(res2=>{
      console.log(res2);
  var row = a.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  var cell4=row.insertCell(3);
  cell1.innerHTML = res2[2];
  cell2.innerHTML = res2[4].c[0];
  cell3.innerHTML =res2[1].c[0];
  cell4.innerHTML= '<button onclick="App.showgraph('+res2[5].c[0]+');return false;" class="acceptreject green">'+'View'+'</button>';
  
      })
    }
 

});
      
},
showgraph:async(status)=>{
  if(status==3){
      setTimeout(function(){enviar()},1000);
    setTimeout(function(){enviar2()},2000);
    setTimeout(function(){enviar3()},3000);
  }
  else if(status==2){
      setTimeout(function(){enviar()},1000);
    setTimeout(function(){enviar2()},2000);
  }
  else if(status==1){
      setTimeout(function(){enviar()},1000);
    setTimeout(function(){enviar2()},2000);
  }
  else if(status==0){
        setTimeout(function(){enviar()},1000);
  }
},
getverified: async()=>{
 console.log(App.tendering);
 App.tendering.app_count().then(res=>{
  console.log(res.c[0]);
  let lc=res.c[0];
  
  let a=document.getElementById('allcontracts');
  for(var i = 0;i<a.rows.length;){
            a.deleteRow(i);
        }
  var row = a.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  cell1.innerHTML = "Contract ID";
  cell2.innerHTML = "UTR NO.";
  cell3.innerHTML ="Supplier Aadhar No.";
  for(var i=1;i<=lc;i++){
    App.tendering.App_Con(i).then(res2=>{
      console.log(res2);
  var row = a.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  cell1.innerHTML = res2[0];
  cell2.innerHTML = res2[1].c[0];
  cell3.innerHTML =res2[2].c[0];
      })
    }
 

});
      
},
getapproved: async()=>{

 console.log(App.tendering);
 App.tendering.idc().then(res=>{
  console.log(res.c[0]);
  let lc=res.c[0];
  
  let a=document.getElementById('allcontracts');
  for(var i = 1;i<a.rows.length;){
            a.deleteRow(i);
        } 
  for(var i=1;i<=lc;i++){
    App.tendering.Req_Con(i).then(res2=>{
      console.log(res2);
  if(res2[5].c[0]==1){
  var row = a.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  var cell4=row.insertCell(3);
  cell1.innerHTML = res2[2];
  cell2.innerHTML = res2[4].c[0];
  cell3.innerHTML =res2[1].c[0];
  cell4.innerHTML='<button onclick="App.disburse('+res2[0].c[0]+');return false;" class="acceptreject green">'+"Disburse"+'</button>';
  }
      })
    }
 

});
      
},

getdisbursed: async()=>{

 console.log(App.tendering);
 App.tendering.idc().then(res=>{
  console.log(res.c[0]);
  let lc=res.c[0];
  
  let a=document.getElementById('allcontracts');
  for(var i = 1;i<a.rows.length;){
            a.deleteRow(i);
        }   
  for(var i=1;i<=lc;i++){
    App.tendering.Req_Con(i).then(res2=>{
      console.log(res2);
  if(res2[5].c[0]==3){
  var row = a.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  var cell4=row.insertCell(3);
  cell1.innerHTML = res2[2];
  cell2.innerHTML = res2[4].c[0];
  cell3.innerHTML =res2[1].c[0];
  cell4.innerHTML='<button class="acceptreject green">'+"Disbursed"+'</button>';
  }
      })
    }
 

});
      
},
getrejected: async()=>{

 console.log(App.tendering);
 App.tendering.idc().then(res=>{
  console.log(res.c[0]);
  let lc=res.c[0];
  
  let a=document.getElementById('allcontracts');
  for(var i = 1;i<a.rows.length;){
            a.deleteRow(i);
        }
  for(var i=1;i<=lc;i++){
    App.tendering.Req_Con(i).then(res2=>{
      console.log(res2);
  if(res2[5].c[0]==2){
  var row = a.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3= row.insertCell(2);
  var cell4=row.insertCell(3);
  cell1.innerHTML = res2[2];
  cell2.innerHTML = res2[4].c[0];
  cell3.innerHTML =res2[1].c[0];
  cell4.innerHTML='<input type=submit  value="Rejected" class="acceptreject red">';
  }
      })
    }
 

});
      
},
approve: async(cid)=>{
 // alert('async called with '+cid);
 console.log(App.tendering);
 let f = await App.tendering.approveTender(cid);
      
},
reject: async(cid)=>{
 // alert('async reject called with '+cid);
 console.log(App.tendering);
 let f = await App.tendering.rejectTender(cid);
      
},
disburse: async(cid)=>{
 // alert('async disburse called with '+cid);
 console.log(App.tendering);
 let f = await App.tendering.disburseTender(cid);
},
checkCustomer: async()=>{
  var account = web3.currentProvider.selectedAddress;
  var c= await App.croping.customerids(account);
  if(c==0)
  {
    window.location.replace("http://localhost:3000/RegisterCustomer.html");
  }
  else
  {
    window.location.replace("http://localhost:3000/CustomerDashboard.html");
    var l= await App.croping.lots(1);
    var edate=l[6];
    //alert(typeof edate);
  }
},


allLots: async() =>{

 //var account = web3.currentProvider.selectedAddress;
 //var fid= await App.croping.farmerids(account);
 //console.log(fid);
 //console.log(App.croping.lots(1));
 //console.log(App.croping.lotCount());
 var lc=0;


////testing lots
//////lots
  var alllots=document.getElementById("customeriddashboard");

 App.croping.lotCount().then(res=>{
  console.log(res.c[0]);
  //document.getElementById("farmeriddashboard").innerHTML="working";
  lc=res.c[0];
  // var tr='';
  var tr='';
  // var alllots=document.getElementById("farmeriddashboard");
  for(var i=1;i<=lc;i++){
    App.croping.lots(i).then(res2=>{
      console.log(res2);
      App.croping.farmers(res2[0]).then(res3=>{
      var cont=res3[3];
            //styling and showing part
      //alert(fid==res2[0].c[0]);
      // if(res2[0].c[0]==fid){
      //alert("inside");
      // if(i%3===0)
      // {tr=tr+'<div class="row">';
      // lasti=i;
      // }

      var lid=res2[1].c[0];
      var ffid=res2[0].c[0];
      var price=res2[4].c[0];
      console.log(lid);
      if(!res2[7]){
      tr = tr+'<div class="col-lg-3">';
      tr += '<div class="lotbox"  >'
      +"<label>" +"Farmer:" + res2[0]+"</label>"+"</br>"
      + "<label>"+ "Lot ID:"+lid+"</label>"+"<br>"
      +"<label>" + "Contact No.:"+cont+"</label>"+"<br>"
      +"<label>" +"Crop: "+ res2[2]+"</label>"+"<br>"
       +"<label>" +"Quantity: "+res2[3]+" kg"+"</label>"+"<br>"
       +'<label id="price">' + "Price: "+res2[4] + "</label>"+"<br>"
       +"<label>" + "Produce Date: " +res2[5] + "</label>"+"<br>"
       // +"<label>" + "Expiry Date:"+res2[6] + "</label>"+"<br>"
       +'<input type="submit" value="order" onclick="App.buy('+lid+','+ffid+','+price+');return false;" class="btn btn-primary">'+"</div>"+"</div>";
      // if(i-2===lasti)
      // {tr=tr+'</div>'}
      // }
      
      console.log(tr);
              alllots.innerHTML=tr;

        }
      //window.location.replace('http://localhost:3000/Viewlots.html');
      });
    })
  }
        alllots.innerHTML+=tr;
})  
},
/*buy: async()=>{

  // alert(document.getElementById('lotid'));
  alert(document.getElementById('price').textContent);
        //await App.croping.buyLot(fid,lid);
},*/

// buy: async()=>{
//App.buy();await App.croping.buyLot(res2[0],res2[1]);
// }
showfarmer:async() =>{
  var account = web3.currentProvider.selectedAddress;
 var cid= await App.croping.farmerids(account);
 var farmerid=document.getElementById('showfarmer');
 farmerid.innerHTML=cid;
},

myPurchases: async() =>{

 var account = web3.currentProvider.selectedAddress;
 var cid= await App.croping.customerids(account);
 //console.log(fid);
 //console.log(App.croping.lots(1));
 //console.log(App.croping.lotCount());
 //var lc=0;


////testing lots
//////lots
  var alllots=document.getElementById("customeriddashboard");
 App.croping.lotCount().then(res=>{
  console.log(res.c[0]);
  //document.getElementById("farmeriddashboard").innerHTML="working";
  lc=res.c[0];
  // var tr='';
  var tr='';
  // var alllots=document.getElementById("farmeriddashboard");
  for(var i=1;i<=lc;i++){
    App.croping.lots(i).then(res2=>{
      console.log(res2);
      //styling and showing part
      //alert(fid==res2[0].c[0]);
      if(res2[8].c[0]==cid&&res2[7]){
      //alert("inside");
      // if(i%3===0)
      // {tr=tr+'<div class="row">';
      // lasti=i;
      // }
      tr = tr+'<div class="col-lg-3">';
      tr += '<div class="lotbox">'
      +"<label>" + "Farmer ID"+res2[0]+"</label>"+"<br>"
      +"<label>" + "Lot ID"+res2[1]+"</label>"+"<br>"
      +"<label>" +"Crop: "+ res2[2]+"</label>"+"<br>"
       +"<label>" +"Quantity: "+res2[3] + "</label>"+"<br>"
       +"<label>" + "Price: "+res2[4] + "</label>"+"<br>"
       +"<label>" + "Produce Date: " +res2[5] + "</label>"+"<br>"
       // +"<label>" + "Expiry Date:"+res2[6] + "</label>"+"<br>"
       +"</div>"+"</div>";
      // if(i-2===lasti)
      // {tr=tr+'</div>'}
      }
      console.log(tr);
              alllots.innerHTML=tr;

      //window.location.replace('http://localhost:3000/Viewlots.html');
    })
  }
        alllots.innerHTML+=tr;

})
 alert(tr);
 console.log(tr);
   alllots.innerHTML = tr;

//  })
//  alert(lc);
//  for(var i=1;i<lc;i++)
//  {
//  var v=await App.croping.lots(i);
//   if(v[0]==fid)
//   {
//    alert(v[1]);
// alert(v[2]);
// alert(v[3]);
// alert(v[4]);
// alert(v[5]);
//    alert(v[6]);
// alert(v[7]);
//   }
 
//  }

},


myLots: async() =>{

 var account = web3.currentProvider.selectedAddress;
 var fid= await App.croping.farmerids(account);
 console.log(fid);
 console.log(App.croping.lots(1));
 console.log(App.croping.lotCount());
 var lc=0;


////testing lots
//////lots
  var alllots=document.getElementById("farmeriddashboard");



 App.croping.lotCount().then(res=>{
  console.log(res.c[0]);
  //document.getElementById("farmeriddashboard").innerHTML="working";
  lc=res.c[0];
  // var tr='';
  var tr='';
  // var alllots=document.getElementById("farmeriddashboard");
  for(var i=1;i<=lc;i++){
    App.croping.lots(i).then(res2=>{
      console.log(res2);
      //styling and showing part
      //alert(fid==res2[0].c[0]);
      if(res2[0].c[0]==fid){
      //alert("inside");
      // if(i%3===0)
      // {tr=tr+'<div class="row">';
      // lasti=i;
      // }
      tr = tr+'<div class="col-lg-3">';
      tr += '<div class="lotbox"  >'
      +"<label>" + "Lot ID: "+res2[1]+"</label>"+"<br>"+"<hr>"
      +"<label>" +"Crop: "+ res2[2]+"</label>"+"<br>"
       +"<label>" +"Quantity: "+res2[3] + "</label>"+"<br>"
       +"<label>" + "Price: "+res2[4] + "</label>"+"<br>"
       +"<label>" + "Produce Date: " +res2[5] + "</label>"+"<br>"
       // +"<label>" + "Expiry Date:"+res2[6] + "</label>"+"<br>"
       +"<label>" + "Sold or Not: "+res2[7] + "</label>"+'<br>'
       +"<label>"+"Buyer: "+res2[8]+"</label>"+"</div>"+"</div>";
      // if(i-2===lasti)
      // {tr=tr+'</div>'}
      }
      console.log(tr);
              alllots.innerHTML=tr;

      //window.location.replace('http://localhost:3000/Viewlots.html');
    })
  }
        alllots.innerHTML+=tr;

})
 alert(tr);
 console.log(tr);
   alllots.innerHTML = tr;

//  })
//  alert(lc);
//  for(var i=1;i<lc;i++)
//  {
//  var v=await App.croping.lots(i);
//   if(v[0]==fid)
//   {
//    alert(v[1]);
// alert(v[2]);
// alert(v[3]);
// alert(v[4]);
// alert(v[5]);
//    alert(v[6]);
// alert(v[7]);
//   }
 
//  }

},

checkLotExpiry: async()=>{
  var l= await App.croping.lots(i);
  var edate=l[6];

},

buy: async(lid,fid,price)=>{
  //alert(lid);
  //alert(fid);
  // alert(document.getElementById('lotid').value);
  var account = web3.currentProvider.selectedAddress;
  // var l =await App.croping.lots(1);
  // var lid= l[0];
  // var fid=l[1];
  await  App.croping.buyLot(fid,lid,{from:account,value:price});
}



}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
