
/*   闭包   立执行函数   */


(function(){
    const searchDiv = document.getElementById("searchId");
    const searchInput = document.getElementById('search');
    const inputRandom = document.getElementById('random');
    const inputCross= document.getElementById('cross');
    const inputSymmetric = document.getElementById('symmetric');
    const c = document.getElementById('canvas');
    let ct;

    //固定画布大小
    c.width = 1000;
    c.height =1000;
    if(c.getContext){
        ct = c.getContext('2d');
    }else{
        return false;
    }

    //画笔初始参数设置；
    let dataC,
        radius = 10,
        lineWidth = 3,
        oBox = document.getElementById('box');



    Array.prototype.insert = function (index, item) {  this.splice(index, 0, item);  };
    Array.prototype.sum = function (){
        return this.reduce(function (partial, value){
            return partial + value;
        })
    };

    /**************************************************数据加载和应用************************************************/

    // $.getJSON('./json/data.json','',function(dataInfo){
        var dataInfo = data;
        dataC = dataInfo.data;
        console.log(dataC);//检验是否读取数据
        let links = dataC.links,
            nodes = dataC.nodes,
            centerNodes = dataC.centerNodes;
        nodes = checkData(nodes);// 去重
    let nodesSection = nodes;

        let space = 100;//画布的旁白空间





        //随机布局
      /*  for(let i=0;i<nodes.length;i++){
            nodes[i].position_X = (c.width - 2 * space) * Math.random() + space;
            nodes[i].position_Y = (c.height - 2 * space) * Math.random() + space;
        }*/




        //圆型布局
        // let R = 15*nodes.length;
        // for(let i=0;i<nodes.length;i++){
        //     nodes[i].position_X = c.width/2 + R*Math.sin(i*nodes.length/360);
        //     nodes[i].position_Y =c.height/2 + R*Math.cos(i*nodes.length/360);
        // }


        //矩形布局




    function rectangle(){
        let l=90;
        let juX = l;
        let juY = l;
        for(let i=0;i<nodes.length;i++){
            if(i%10 == 9){
                nodes[i].position_X = juX;
                nodes[i].position_Y =juY;
                juY = juY +l;
                juX = l;

            }else{
                nodes[i].position_X = juX;
                nodes[i].position_Y =juY;
                juX  = juX+l;
            }

        }
    }
    rectangle();

        //优化一下

    //圆环布局
    let matrix = [];
    function setMatrix(){
        for(let i=0;i<nodes.length;i++){
            matrix[i]  = [];
            for(let j=0;j<nodes.length;j++){
                matrix[i][j] =0;
            }
        }
        for(let i=0;i<nodes.length;i++){
            for(let j=0;j<nodes.length;j++){
                for(let k=0;k<links.length;k++){
                    if(nodes[i].id==links[k].startNode && nodes[j].id == links[k].endNode){
                        matrix[i][j] = 1;
                        matrix[j][i] = 1;
                    }
                }
            }
        }


    }
    setMatrix();
    for(let i=0;i<nodes.length;i++){
        // nodes[i].degree = Math.sum(matrix[i]);
        let sum =0;
        matrix[i].forEach(function(item,index,array){
            sum += item;
        });
        nodes[i].degree = sum;

    }


    // console.log(matrix);

    function methodRandom(){
        nodes = nodesSection;
        rectangle();

    }
    function methodCross(matrixV){
        let nodesData = [];
        for(let i=0;i<nodes.length;i++){
            if(checkPoint(i,nodes,centerNodes)){
                nodesData.push(nodes[i]);
                for(let j=0;j<nodes.length;j++){
                    if(matrixV[i][j]){
                        nodesData.push(nodes[j]);
                        for(let k=0;k<nodes.length;k++){
                            matrixV[k][j]=0;
                            matrixV[j][k]=0;
                        }
                    }
                }
            }
        }
        nodes = nodesData;
        console.log(nodesData.length);
        rectangle();
    }
    function methodSymmetric(matrixV){
        let nodesData = [];
        for(let i=0;i<nodes.length;i++){
            if(checkPoint(i,nodes,centerNodes)){
                let degree =0;
                for(let j=0;j<nodes.length;j++){
                    if(matrixV[i][j]){
                        // console.log(matrixV[i][j]);
                        nodesData.push(nodes[j]);
                        degree++;
                        for(let k=0;k<nodes.length;k++){
                            matrix[k][j]=0;
                            matrix[j][k]=0;
                        }
                    }
                }
                nodesData.insert(Math.round(nodesData.length - degree/2),nodes[i]);
            }
        }
        nodes = nodesData;
        rectangle();

    }

    // methodTwo();
    // methodThree();
    inputRandom.addEventListener('click',function(){
        // setMatrix();
        methodRandom();
        drawing(nodes,links,centerNodes);//绘制图形
        //搜索框事件
    });
    inputCross.addEventListener('click',function(){
        setMatrix();
        methodCross(matrix);
        drawing(nodes,links,centerNodes);//绘制图形
        //搜索框事件
    });
    inputSymmetric.addEventListener('click',function(){
        setMatrix();
        methodSymmetric(matrix);
        drawing(nodes,links,centerNodes);//绘制图形
        //搜索框事件
    });







    //分图 重新绘制坐标点

   /*     let matrix = [];
        for(let i=0;i<nodes.length;i++){
            matrix[i]  = [];
            for(let j=0;j<nodes.length;j++){
                matrix[i][j] =[];
                matrix[i][j].push([i,j,0]);

            }
        }
        // console.log(matrix[0][0][0]);

        for(let i=0;i<nodes.length;i++){
            for(let j=0;j<nodes.length;j++){
                for(let k=0;k<links.length;k++){
                    if(nodes[i].id==links[k].startNode && nodes[j].id == links[k].endNode){
                        matrix[i][j][2] = 1;
                        console.log(i,j);

                    }
                }
            }
        }
        let setA=new Set();
        setA.add(links[0].startNode);
        setA.add(links[0].endNode);
        for(let i=1;i<links.length;i++){
            for(let j=0;j<setA.size;j++){
                if(links[i]==setA)
                    setA.add(links[0].startNode);
                setA.add(links[0].endNode);
            }
        }
        console.log(matrix);*/










        //添加基本常数初始数据
        for(let i=0;i<nodes.length;i++){
            let flag = 0;
            nodes[i].index = 0;
            for(let j=0;j<centerNodes.length;j++){
                if(nodes[i].id == centerNodes[j]){
                    flag = 1;
                }
            }
            if(flag){
                nodes[i].radius = radius;
                nodes[i].lineWidth = lineWidth;
            }else{
                nodes[i].radius = radius * 0.5;
                nodes[i].lineWidth = lineWidth * 0.5;
            }
        }
        drawing(nodes,links,centerNodes);//绘制图形
        //搜索框事件
        searchInput.onkeydown = function(ev){
            let e = ev || event;
            if(e.keyCode == "13"){
                const idNum = searchInput.value;
                // console.log(idNum);//测试
                let flag = -1;
                for(let i=0;i<nodes.length;i++){
                    if(nodes[i].id == idNum){
                        flag = i;
                    }
                }
                if(flag >-1){
                    // console.log(idNum);
                    ct.beginPath();
                    ct.fillStyle = "red";
                    ct.arc(nodes[flag].position_X,nodes[flag].position_Y,radius*0.5,0,Math.PI*2);
                    ct.fill();
                }else{
                    alert("请核对id！");
                }
            }
        };

        //点击事件函数
        c.onmousedown = function(ev){
            //清除弹跳框
            clearInfoBox();

            let oldTime = (new Date()).getTime();
            let ed = ev || event;
            let xd = ed.clientX - c.getBoundingClientRect().left;
            let yd = ed.clientY - c.getBoundingClientRect().top;
            let sq = -1;
            for(let i=0;i<nodes.length;i++){
                let sqVal = Math.sqrt(Math.pow(xd-nodes[i].position_X,2)+Math.pow(yd-nodes[i].position_Y,2));
                if(sqVal < radius + lineWidth){
                    sq = i;
                    break;//查找第一个满足点击点的数据索引值
                }
            }
            if(sq > -1){
                document.onmousemove = function(ev){
                    let em = ev || event;
                    let xm = em.clientX - c.getBoundingClientRect().left;
                    let ym = em.clientY - c.getBoundingClientRect().top;
                    nodes[sq].position_X = xm;
                    nodes[sq].position_Y = ym;
                    ct.clearRect(0,0,c.width,c.height);
                    drawing(nodes,links,centerNodes);
                };
                document.onmouseup = function(ev){

                    var event = ev || event;
                    var x = event.clientX - c.getBoundingClientRect().left;
                    var y = event.clientY - c.getBoundingClientRect().top;
                    // nodes[sq].position_X = x;
                    // nodes[sq].position_Y = y;

                    document.onmousemove = document.onmouseup = null;
                    let newTime = (new Date()).getTime();
                    if(newTime-oldTime<200){
                        ct.clearRect(0,0,c.width,c.height);
                        drawing(nodes,links,centerNodes);
                        if(oBox.getElementsByClassName("insert").length){
                            for(let s =0;s<oBox.getElementsByClassName("insert").length;s++){
                                oBox.removeChild(oBox.getElementsByClassName("insert")[s]);
                            }
                        }

                        checkC(x,y,nodes,centerNodes,sq);
                    }
                };
            }
            else{
               haiLunFun(links,nodes,xd,yd,centerNodes);
            }
        };




        //清除弹跳框
        function clearInfoBox(){
            if(oBox.querySelector('.insert')){
                let oDiv = oBox.querySelector('.insert');
                ct.clearRect(0,0,c.width,c.height);
                drawing(nodes,links,centerNodes);
                oBox.removeChild(oDiv);
            }
            if(oBox.querySelector('.pay')){
                let oDiv = oBox.querySelector('.pay');
                ct.clearRect(0,0,c.width,c.height);
                drawing(nodes,links,centerNodes);
                oBox.removeChild(oDiv);
            }
        }
        //创建div显示企业的详细信息
        function  createElementDiv(dataInfo,m,nodes,links,centerNodes){
            if(oBox.querySelector('.insert')){
                let oDiv = oBox.querySelector('.insert');
                ct.clearRect(0,0,c.width,c.height);
                drawing(nodes,links,centerNodes);
                oBox.removeChild(oDiv);
            }
            if(oBox.querySelector('.pay')){
                let oDiv = oBox.querySelector('.pay');
                ct.clearRect(0,0,c.width,c.height);
                drawing(nodes,links,centerNodes);
                oBox.removeChild(oDiv);
            }


            let oDiv;
            oDiv = document.createElement('div');
            oDiv.className = "insert";
            if(dataInfo.name){
                // console.log(dataInfo);
                const h4 = document.createElement('h4');
                const p = document.createElement('p');
                h4.innerHTML = dataInfo.name +"<a href='http://www.gl-data.com/'>查看详细信息>></a>";
                p.innerHTML = "名称："+"<span>"+ dataInfo.name +"</span>";
                hr = document.createElement('hr');
                oDiv.appendChild(h4);
                oDiv.appendChild(hr);
                oDiv.appendChild(p);
            }
            if(dataInfo.ctype){
                const p = document.createElement('p');
                p.innerHTML = "性质："+"<span>"+ dataInfo.ctype+"</span>";
                oDiv.appendChild(p);
            }
            if(dataInfo.id){
                const p = document.createElement('p');
                p.innerHTML = "ID："+"<span>"+ dataInfo.id+"</span>";
                oDiv.appendChild(p);
            }
            if(dataInfo.type){
                const p = document.createElement('p');
                p.innerHTML = "类型："+"<span>"+ dataInfo.type+"</span>";
                oDiv.appendChild(p);
            }
            if(dataInfo.state){
                const p = document.createElement('p');
                p.innerHTML = "公司状态："+"<span>"+ dataInfo.state+"</span>";
                oDiv.appendChild(p);
            }
            if(dataInfo.time){
                const p = document.createElement('p');
                p.innerHTML = "注册时间："+"<span>"+ dataInfo.time+"</span>";
                oDiv.appendChild(p);
            }
            oDiv.style.left = nodes[m].position_X + 10 + 'px';
            oDiv.style.top = nodes[m].position_Y +  10 + 'px';
            oDiv.addEventListener('click',function(){
                oBox.removeChild(oDiv);
                ct.clearRect(0,0,c.width,c.height);
                drawing(nodes,links,centerNodes);

                // flag_dra=0
            });
            oBox.appendChild(oDiv);
        }
        //创建div显示企业支付关系div
        function createElementPay(link,nodes,x,y,centerNodes){
            let oDiv  = document.createElement('div');
            oDiv.className = 'pay';
            let h4 = document.createElement('h4');
            h4.innerHTML = "支付关系";
            let hr = document.createElement('hr');
            oDiv.appendChild(h4);
            oDiv.appendChild(hr);
            for(let i =0;i<nodes.length;i++){
                if(nodes[i].id == link.endNode){
                    let p =document.createElement('p');
                    p.innerHTML = "收款方：" + "<span>"+nodes[i].name+"</span>";
                    oDiv.appendChild(p);
                }
                if(nodes[i].id == link.startNode){
                    let p =document.createElement('p');
                    p.innerHTML = "付款方：" + "<span>"+nodes[i].name+"</span>";
                    oDiv.appendChild(p);
                }

            }
            if(link.count){
                let p =document.createElement('p');
                p.innerHTML = "支付次数：" + "<span>"+link.count+"</span>";
                oDiv.appendChild(p);
            }
            oDiv.style.left = x + "px";
            oDiv.style.top= y + "px";
            oDiv.addEventListener('click',function(){
                oBox.removeChild(oDiv);
                ct.clearRect(0,0,c.width,c.height);
                drawing(nodes,links,centerNodes);

                // flag_dra=0
            });

            oBox.appendChild(oDiv);
            drawLineTwo(checkIndex(link.startNode,nodes),checkIndex(link.endNode,nodes),link.count);

        }
        //判断点击位置和节点的距离
        function checkC(x,y,nodes,centerNodes,flag){
            // for(let i=0;i<nodes.length;i++){
                // if(Math.sqrt( Math.pow(x - nodes[i].position_X, 2) + Math.pow(y - nodes[i].position_Y, 2)) < nodes[i].radius+nodes[i].lineWidth){

                    if(checkPoint(flag,nodes,centerNodes)){
                        console.log("kankan");

                        ct.beginPath();
                        ct.strokeStyle = "#dd63c5";
                        ct.lineWidth = 3;
                        ct.arc(nodes[flag].position_X,nodes[flag].position_Y, nodes[flag].radius, 0, Math.PI * 2);
                        ct.stroke();
                    }else{
                        ct.beginPath();
                        ct.strokeStyle = "#0f0";
                        ct.arc(nodes[flag].position_X,nodes[flag].position_Y, nodes[flag].radius, 0, Math.PI * 2);
                        ct.stroke();
                    }
                    createElementDiv(nodes[flag].propertyList,flag,nodes,links,centerNodes);
                // }
            // }
        }
        //创建支付弹跳窗
        function haiLunFun(links,nodes,xd,yd,centerNodes){
            for(let j=0;j<links.length;j++){
                let startNodeId = links[j].startNode;
                let endNodeId = links[j].endNode;
                let startPoint =  checkIndex(startNodeId,nodes);
                let endPoint=  checkIndex(endNodeId,nodes);
                let a = Math.sqrt(Math.pow(startPoint.position_X - endPoint.position_X,2) + Math.pow(startPoint.position_Y - endPoint.position_Y,2));
                let b = Math.sqrt(Math.pow(startPoint.position_X - xd,2) + Math.pow(startPoint.position_Y - yd,2));
                let c = Math.sqrt(Math.pow(endPoint.position_X - xd,2) + Math.pow(endPoint.position_Y - yd,2));
                let p = (a+b+c)/2;
                let h = 2*Math.sqrt(p*(p-a)*(p-b)*(p-c))/a;
                let angleA = Math.acos((a*a+c*c-b*b)/(2*a*c));
                let angleB = Math.acos((a*a+b*b-c*c)/(2*a*b));
                if(h<2 && angleA<Math.PI/2 && angleB<Math.PI/2 ){
                    createElementPay(links[j],nodes,xd,yd,centerNodes);
                    break;
                }
            }
        }

    // });

})();

