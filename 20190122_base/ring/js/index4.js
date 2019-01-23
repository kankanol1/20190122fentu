
/*   闭包   立执行函数   */


(function(){


    //在数组的原型链上添加方法属性
    Array.prototype.sum = function (){
        return this.reduce(function (partial, value){
            return partial + value;
        })
    };
    Array.prototype.insert = function (index, item) {  this.splice(index, 0, item);  };



    const searchDiv = document.getElementById("searchId");
    const searchInput = document.getElementById('search');
    const c = document.getElementById('canvas');
    let ct;

    //固定画布大小
    c.width = 1000;
    c.height =800;
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


    /**************************************************数据加载和应用************************************************/

    // $.getJSON('./json/data.json','',function(dataInfo){
        var dataInfo = data;
        dataC = dataInfo.data;
        console.log(dataC);//检验是否读取数据
        let links = dataC.links,
            nodes = dataC.nodes,
            centerNodes = dataC.centerNodes;
        nodes = checkData(nodes);// 去重
        let space = 100;//画布的旁白空间





        //随机布局
        /*for(let i=0;i<nodes.length;i++){
            nodes[i].position_X = (c.width - 2 * space) * Math.random() + space;
            nodes[i].position_Y = (c.height - 2 * space) * Math.random() + space;
        }
*/



        //圆型布局
        // let R = 15*nodes.length;
        // for(let i=0;i<nodes.length;i++){
        //     nodes[i].position_X = c.width/2 + R*Math.sin(i*nodes.length/360);
        //     nodes[i].position_Y =c.height/2 + R*Math.cos(i*nodes.length/360);
        // }


        //矩形布局
   /* function rectangle(){
        let l=150;
        let juX = l;
        let juY = l;
        for(let i=0;i<nodes.length;i++){
            if(i%10 == 9){
                juY = juY +l;
                juX = l;
            }else{
                nodes[i].position_X = juX;
                nodes[i].position_Y =juY;
                juX  = juX+l;
            }

        }
    }
    rectangle();*/


    //圆环布局
    let matrix = [];
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

    for(let i=0;i<nodes.length;i++){
        // nodes[i].degree = Math.sum(matrix[i]);
        let sum =0;
        matrix[i].forEach(function(item,index,array){
            sum += item;
        });
        nodes[i].degree = sum;

    }
    R =160;
   // 中心节点的位置的确定
   for(let i=0;i<centerNodes.length;i++){
        nodes[checkIndexId(centerNodes[i],nodes)].position_X = c.width/2 + R*Math.sin(i/centerNodes.length*2*Math.PI);
        nodes[checkIndexId(centerNodes[i],nodes)].position_Y = c.height/2 + R*Math.cos(i/centerNodes.length*2*Math.PI);
   }

   //s失败
/*   for(let i=0;i<nodes.length;i++){
       for(let j=0;j<nodes.length;j++){
           if(matrix[i][j] == 1 && nodes[i].degree==1){
               console.log('测试');
// console.log(!checkPoint(i,nodes,centerNodes) , checkPoint(j,nodes,centerNodes ));
               if(!checkPoint(i,nodes,centerNodes) && checkPoint(j,nodes,centerNodes )){

                   console.log('测试');
                   nodes[i].position_X = nodes[j].position_X +(nodes[j].position_X-nodes[i].position_X)*100/Math.abs(nodes[j].position_X-nodes[i].position_X);
                   nodes[i].position_Y = nodes[j].position_Y +(nodes[j].position_Y-nodes[i].position_Y)*100/Math.abs(nodes[j].position_Y-nodes[i].position_Y);
               }
           }
       }
   }*/
    let xLong = 0;
    let yLong = 0;
    for(let i=0;i<centerNodes.length;i++){
        xLong += checkIndex(centerNodes[i],nodes).position_X;
        yLong += checkIndex(centerNodes[i],nodes).position_Y;
    }
    xLong = xLong/centerNodes.length;
    yLong = yLong/centerNodes.length;

    //求一个度数最多的节点
    let nodeId = 0;
    let array = [];
    for(let i=0;i<nodes.length;i++){
        let sum=0;
        matrix[i].forEach(function(item,index){
            sum = sum + item;
        });
        array.push(sum);
    }
    // console.log('求和：',array);
    array.forEach(function(item,index){
        nodeId = nodeId+item;
    });
    let MAX_VALUE =Math.max(...array);
    // console.log(MAX_VALUE);


   //叶子节点度数等于1位置确定
   for(let i=0;i<centerNodes.length;i++){
       let flag  = checkIndexId(centerNodes[i],nodes);
       let alpha = Math.atan(Math.abs(yLong-nodes[flag].position_Y)/Math.abs(xLong-nodes[flag].position_X));
       let n = 0;//标记
       let outL = 3;//放大系数
       for(let j=0;j<nodes.length;j++){
           if(matrix[flag][j]==1 && nodes[j].degree==1){
               let scaleC = outL*(nodes[flag].degree + Math.abs(nodes[flag].degree - MAX_VALUE))/MAX_VALUE*R ;

               if(nodes[flag].degree != 1){
                   scaleC = (1-2/nodes[flag].degree)*scaleC;
               }else{
                   scaleC = scaleC/2;
               }
               if(nodes[flag].position_X -c.width/2 >0 &&nodes[flag].position_Y -c.height/2 >0){
                   nodes[j].position_X = c.width/2 + scaleC *Math.cos(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2);
                   nodes[j].position_Y = c.height/2 + scaleC  *Math.sin(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2);
                   n = n+1;
               }
               if(nodes[flag].position_X -c.width/2 >0 &&nodes[flag].position_Y -c.height/2 <=0){
                   nodes[j].position_X = c.width/2 + scaleC *Math.cos(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2 -Math.PI/2);
                   nodes[j].position_Y = c.height/2 +scaleC*Math.sin(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2-Math.PI/2);
                   n = n+1;
               }
               if(nodes[flag].position_X -c.width/2 <=0 &&nodes[flag].position_Y -c.height/2 <=0){
                   nodes[j].position_X = c.width/2 + scaleC *Math.cos(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2 -Math.PI);
                   nodes[j].position_Y = c.height/2 + scaleC *Math.sin(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2-Math.PI);
                   n = n+1;
               }
               if(nodes[flag].position_X -c.width/2 <=0 &&nodes[flag].position_Y -c.height/2 >0){
                   nodes[j].position_X = c.width/2 + scaleC *Math.cos(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2 -Math.PI/4+Math.PI);
                   nodes[j].position_Y = c.height/2 +scaleC *Math.sin(alpha - Math.PI/2/centerNodes.length+n/nodes[flag].degree*Math.PI/centerNodes.length*2-Math.PI/4+Math.PI);
                   n = n+1;
               }

           }
       }
   }

   //叶子节点度数大于1位置确定
    for(let i=0;i<nodes.length;i++){
       if(!checkPoint(i,nodes,centerNodes)){
           // let array=matrix[i];
           if(matrix[i].sum()>1){
               let xL = 0,
                   yL = 0;
               for(let j=0;j<nodes.length;j++){
                   if(matrix[i][j] == 1){
                       xL = xL + nodes[j].position_X;
                       yL = yL + nodes[j].position_Y;
                   }
               }
               nodes[i].position_X = xL/matrix[i].sum();
               nodes[i].position_Y = yL/matrix[i].sum();
           }

       }

    }
















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
                        ct.lineWidth = 5;
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

    //    在原型链上添加求和属性
    Array.prototype.sum = function (){
        return this.reduce(function (partial, value){
            return partial + value;
        })
    };

    // });

})();

