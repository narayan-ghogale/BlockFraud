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
if(v[0]==id)
{
  alert("Already registered");
}
else
{
await App.tendering.registerContractor(id,name);
window.location.replace("http://localhost:3000/process.html");

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
  
var pro_name = document.getElementById("pname").value;
var sup_name= document.getElementById("sname").value;
var budget =document.getElementById("amount").value;
//alert(pro_name,sup_name,budget);
await App.tendering.insertTender(pro_name,sup_name,budget);
 },

 disburse_bill: async() =>{
  
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
}




}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
