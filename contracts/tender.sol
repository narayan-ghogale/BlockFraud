pragma solidity ^0.5.0;

contract tender{
enum Status {scrutiny,approved,rejected,disbursed}
    struct req_con{
        uint cid;
        uint cuid;
        string project_name;
        string supplier_name;
        uint budget;
        Status status;
    }
    
    struct app_con{
        string project_name;
        uint utr;
        uint suid;
    }
    
    struct contractor{
        uint cuid;
        string company_name;
        address add;
    }
    
    
      struct ContractorId{
        uint cuid;
    }
    
    uint public idc=0;
    uint public app_count=0;
    mapping(uint => req_con) public Req_Con;
    mapping(uint => app_con) public App_Con;
    mapping(uint => contractor) public Contractor;
     mapping(address => ContractorId) public contractorids;
    
    
    function registerContractor(uint _uid,string memory compname) public{
        Contractor[_uid].cuid=_uid;
        Contractor[_uid].company_name=compname;
        Contractor[_uid].add=msg.sender;
        contractorids[msg.sender].cuid=_uid;
        
    }
    
    function insertTender(string memory project,string memory supplier,uint amount)public
    {
        idc=idc+1;
        Req_Con[idc].cid=idc;
        Req_Con[idc].cuid= contractorids[msg.sender].cuid;
    
        Req_Con[idc].project_name=project;
        Req_Con[idc].supplier_name=supplier;
        Req_Con[idc].budget=amount;
        Req_Con[idc].status=Status.scrutiny;
    }
    
    
    function approveTender(uint con_id)public{
        Req_Con[con_id].status=Status.approved;
    }
    
    function rejectTender(uint con_id)public{
        Req_Con[con_id].status=Status.rejected;
    }
    
    function disburseTender(uint con_id)public{
        Req_Con[con_id].status=Status.disbursed;
    }
    
    function funds_usage(string memory pname,uint utr_no,uint uid)public{
        app_count=app_count+1;
        App_Con[app_count].project_name=pname;
        App_Con[app_count].utr=utr_no;
        App_Con[app_count].suid=uid;
    }
}