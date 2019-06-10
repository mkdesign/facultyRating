# Faculty Rating System
---
#Our Enterprise design patterns
In this project, we implemented 2 design patterns (verification pattern and whitelist pattern) to solve the challenges that current faculty member rating system faces.

Current professor rating system, like the most popular "rate my professors", has always been seen as a flawed teaching evaluation rating system; it allows students to leave their ratings and comments about their professor anonymously on the website, and students could only rate their professors based on 4 ratings: helpfulness, clarity, easiness, hotness (massive gender-based bias!!). Moreover, since it is an open platform, anyone can comment on professors anonymously, therefore, it gives malicious users opportunities to write scathing, and untruthful comments about the profs, even though they never took the courses from the profs they rated. 

The solution that our project provids is that we only allow students who took the course/enroll in the course (whitelisted users) to rate their professpors; the rating system is decentralized, immutable, and can prevent malicious users from taking advantage of the anonymity the system provides.

Although the decentralized prof rating system could improve our curernt flawed system, it still has limitations. The whitelist design pattern implemented into our project is to only allow a list of acceptable users to have an access to our system, it is based on a "zero trust" principle, but it is also challenging to keep the whitelists up to date, as it would require to store a large amount of data on-chain.

---
#Usage
**The contract is getting feedback of students on each faculty**
**Students are able to give their feedback based on their statisfaction percentage**

- Create counract name *FacultyRating*
```
contract FacultyRating {

}
```
- Declare the admin
```
address public admin
```
- Create student whitelist
 ```
 mapping (address => bool) private whiteList
 ```
- Structrue the rating information (1.feedBackCount, 2.average of the vote, 3.if the information is existing or not )

```
struct rateInfo {
        uint256 feedBackCounter;
        uint8 average; 
        bool flag; 
        
    }
```
- Maps teachers address to their rating information 
```
mapping (address => rateInfo ) private teachers;
```
- Add a constructor so that our Contract can be instantiated
```
constructor(address[] memory _students, address [] memory _teachers) public {
        admin = msg.sender;
        }
```
- Only allow admin to modify
```
 modifier onlyAdmin {
        require(msg.sender == admin, 'You must be admin!');
        _;
    }
```
- Function *isWhiteListed* is to check if the student on whitelist or not 

- Function *addWhiteList* is to add the new stuudnet on the list(only administer can add)

- Function *removeFromWhiteList* is to remove the the student on the list(only administer can remove)

- Function *sendFeedBack* is to let student send feedback to teacher

- Function *getRates* is to get the teachers' rates (only administer can get rates result)


---
#Test
Test embark
```
$ embark test
```
---
##License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/mkdesign/facultyRating/blob/master/LICENSE) file for details




