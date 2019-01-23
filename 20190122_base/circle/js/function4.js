/********************************************* 函数封装*********************************************************/




    const searchDiv = document.getElementById("searchId");
    const searchInput = document.getElementById('search');
    const c = document.getElementById('canvas');
    let ct;

//固定画布大小
    c.width = 1000;
    c.height = 800;
    if(c.getContext){
        ct = c.getContext('2d');
    }else{
        console.log(0);
    }

//画笔初始参数设置；
    let dataC,
        radius = 8,
        lineWidth = 3,
        oBox = document.getElementById('box');







//剔除重复数据
    function checkData(data){
        let newData = [];
        for(let i=0;i<data.length;i++){
            let flag = 0;
            for(let j=i+1;j<data.length;j++){
                if(data[i].id == data[j].id){
                    flag =1;
                }
            }
            if(flag ==0){
                newData.push(data[i]);
            }
        }
        return newData;
    }

//创建div显示企业的详细信息
    function  createElementDiv(dataInfo,m,nodes){
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
        oBox.appendChild(oDiv);
    }

    /*px:点的x坐标
      py:点的y坐标
      r:半径
      lw:线宽
      n:节点索引*/
//绘制中心节点
    function drawingC(px,py,r,lw,n,nodes){
        ct.beginPath();
        ct.lineWidth = lw;
        ct.fillStyle = "#ffea17";
        ct.strokeStyle = "#0f0";
        ct.arc(px,py,r, 0, Math.PI * 2);
        ct.fill();
        ct.stroke();
        setFont();//设置字体
        ct.fillText(nodes[n].propertyList.name.slice(0,5)+"...",px ,py - r-12);
        // ct.fillStyle = "#fff";

    }
//绘制叶子节点
    function drawingN(px,py,r,lw,n,nodes){
        ct.beginPath();
        ct.lineWidth = lw;
        ct.fillStyle = "#00f";
        ct.strokeStyle = "#fff";
        ct.arc(px,py,r, 0, Math.PI * 2);
        ct.fill();
        ct.stroke();
        setFont();//设置字体
        ct.fillText(nodes[n].propertyList.name.slice(0,5)+"...",px ,py - r-12);
        // ct.fillStyle = "#fff";

    }
//字体设置
    function setFont(){
        ct.fillStyle = "#000";
        ct.font = "lighter 10px Arial";
        ct.textAlign = "center";
        ct.textBaseline = "middle";
    }
//设置title样式
    function setTitle(){
        ct.fillStyle = "#000";
        ct.font = "lighter 20px Arial";
        ct.textAlign = "center";
        ct.textBaseline = "middle";
    }

//判断节点是否为中心节点
    function checkPoint(n,nodes,centerNodes){
        let flag = 0;
        for(let i=0;i<centerNodes.length;i++){
            if(nodes[n].id == centerNodes[i]){
                flag = 1;
            }
        }
        return flag;
    }

//根据id检测节点索引
    function checkIndex(id,nodes){
        for(let i=0;i<nodes.length;i++){
            if(id == nodes[i].id){
                return nodes[i];
            }
        }
    }

//通过id检查元素索引
//绘制箭头
let triC = 6;
    function drawTriangleRB(x,y,alpha,beta){
        // ct.strokeStyle = "#666";
        // ct.fillStyle = "#666";
        ct.lineTo(x+triC*Math.cos(beta - Math.PI/6),y+triC*Math.sin(beta -Math.PI/6));
        ct.lineTo(x+triC*Math.sin(alpha - Math.PI/6),y+triC*Math.cos(alpha - Math.PI/6));
        ct.lineTo(x,y);
        ct.stroke();
        ct.fill();
    }
    function drawTriangleRT(x,y,beta,alpha){
        // ct.strokeStyle = "#666";
        // ct.fillStyle = "#666";
        ct.lineTo(x+triC*Math.sin(beta - Math.PI/6),y-triC*Math.cos(beta -Math.PI/6));
        ct.lineTo(x+triC*Math.cos(alpha - Math.PI/6),y-triC*Math.sin(alpha - Math.PI/6));
        ct.lineTo(x,y);
        ct.stroke();
        ct.fill();
    }
    function drawTriangleLB(x,y,alpha,beta){
        // ct.strokeStyle = "#666";
        // ct.fillStyle = "#666";
        ct.lineTo(x-triC*Math.cos(beta - Math.PI/6),y+triC*Math.sin(beta -Math.PI/6));
        ct.lineTo(x-triC*Math.sin(alpha - Math.PI/6),y+triC*Math.cos(alpha - Math.PI/6));
        ct.lineTo(x,y);
        ct.stroke();
        ct.fill();
    }
    function drawTriangleLT(x,y,alpha,beta){

        ct.lineTo(x-triC*Math.cos(beta - Math.PI/6),y-triC*Math.sin(beta -Math.PI/6));
        ct.lineTo(x-triC*Math.sin(alpha - Math.PI/6),y-triC*Math.cos(alpha - Math.PI/6));
        ct.lineTo(x,y);
        ct.stroke();
        ct.fill();
    }
//绘制连线
    function drawLine(nodeO,nodeT,pay){
        ct.beginPath();
        ct.lineWidth = 0.5;
        ct.strokeStyle = "#666";
        ct.fillStyle = "#666";
        let mdx = Math.abs(nodeO.position_X+nodeT.position_X)/2;
        let mdy = Math.abs(nodeO.position_Y+nodeT.position_Y)/2;
        let alpha = Math.atan(Math.abs(nodeO.position_X-nodeT.position_X)/Math.abs(nodeO.position_Y-nodeT.position_Y));
        let beta =  Math.atan(Math.abs(nodeO.position_Y-nodeT.position_Y)/Math.abs(nodeO.position_X-nodeT.position_X));
        // ct.moveTo((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
        // ct.rotate(alpha+ Math.PI/2);
        // ct.fillText("支付("+pay+")",0,0);
        // ct.fillText("支付("+pay+")",(nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
        // ct.rotate(-(alpha+ Math.PI/2));

        let textL = 25;

        if( nodeO.position_X>nodeT.position_X && nodeO.position_Y>nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  - Math.cos(beta)*(radius+5) ,nodeO.position_Y - Math.sin(beta) * (radius+5));
            ct.lineTo(mdx + Math.sin(alpha)*textL,mdy + Math.cos(alpha)*textL);
            ct.moveTo(mdx - Math.sin(alpha)*textL,mdy - Math.cos(alpha)*textL);
            // console.log("测试");

            ct.lineTo(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleRB(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5,alpha,beta);
            // ct.moveTo((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);

            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(-(alpha- Math.PI/2));
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate((alpha- Math.PI/2));
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }
        if( nodeO.position_X>nodeT.position_X && nodeO.position_Y<=nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  - Math.cos(beta)*(radius+5) ,nodeO.position_Y + Math.sin(beta) * (radius+5));
            ct.lineTo(mdx + Math.sin(alpha)*textL,mdy - Math.cos(alpha)*textL);
            ct.moveTo(mdx - Math.sin(alpha)*textL,mdy + Math.cos(alpha)*textL);
            ct.lineTo(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleRT(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5,alpha,beta)

            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(alpha-Math.PI/2);
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate(-(alpha-Math.PI/2));
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }
        if( nodeO.position_X<=nodeT.position_X && nodeO.position_Y>nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  + Math.cos(beta)*(radius+5) ,nodeO.position_Y - Math.sin(beta) * (radius+5));
            ct.lineTo(mdx - Math.sin(alpha)*textL,mdy + Math.cos(alpha)*textL);
            ct.moveTo(mdx + Math.sin(alpha)*textL,mdy - Math.cos(alpha)*textL);
            ct.lineTo(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleLB(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5,alpha,beta)
            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(alpha-Math.PI/2);
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate(-alpha+Math.PI/2);
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }
        if( nodeO.position_X<=nodeT.position_X && nodeO.position_Y<=nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  + Math.cos(beta)*(radius+5) ,nodeO.position_Y + Math.sin(beta) * (radius+5));
            ct.lineTo(mdx - Math.sin(alpha)*textL,mdy - Math.cos(alpha)*textL);
            ct.moveTo(mdx + Math.sin(alpha)*textL,mdy + Math.cos(alpha)*textL);
            ct.lineTo(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleLT(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5,alpha,beta)
            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(-(alpha-Math.PI/2));
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate(alpha-Math.PI/2);
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }
        ct.stroke();
        ct.fill();
        ct.lineWidth = 5;
    }
    function drawLineTwo(nodeO,nodeT,pay){
        let textL = 25;
        ct.beginPath();
        ct.lineWidth = 1;
        ct.strokeStyle = "red";
        ct.fillStyle = "red";
        let mdx = Math.abs(nodeO.position_X+nodeT.position_X)/2;
        let mdy = Math.abs(nodeO.position_Y+nodeT.position_Y)/2;
        let alpha = Math.atan(Math.abs(nodeO.position_X-nodeT.position_X)/Math.abs(nodeO.position_Y-nodeT.position_Y));
        let beta =  Math.atan(Math.abs(nodeO.position_Y-nodeT.position_Y)/Math.abs(nodeO.position_X-nodeT.position_X));

        // ct.fillText("支付("+pay+")",(nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);

        if( nodeO.position_X>nodeT.position_X && nodeO.position_Y>nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  - Math.cos(beta)*(radius+5) ,nodeO.position_Y - Math.sin(beta) * (radius+5));

            ct.lineTo(mdx + Math.sin(alpha)*textL,mdy + Math.cos(alpha)*textL);
            ct.moveTo(mdx - Math.sin(alpha)*textL,mdy - Math.cos(alpha)*textL);

            ct.lineTo(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleRB(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5,alpha,beta);
            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(-(alpha- Math.PI/2));
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate((alpha- Math.PI/2));
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);

        }
        if( nodeO.position_X>nodeT.position_X && nodeO.position_Y<=nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  - Math.cos(beta)*(radius+5) ,nodeO.position_Y + Math.sin(beta) * (radius+5));
            ct.lineTo(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleRT(nodeT.position_X + Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5,alpha,beta)

            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(alpha-Math.PI/2);
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate(-(alpha-Math.PI/2));
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }
        if( nodeO.position_X<=nodeT.position_X && nodeO.position_Y>nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  + Math.cos(beta)*(radius+5) ,nodeO.position_Y - Math.sin(beta) * (radius+5));
            ct.lineTo(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleLB(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  + Math.cos(alpha) * (radius+5)*0.5,alpha,beta)
            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(alpha-Math.PI/2);
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate(-alpha+Math.PI/2);
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }
        if( nodeO.position_X<=nodeT.position_X && nodeO.position_Y<=nodeT.position_Y) {
            ct.moveTo(nodeO.position_X  + Math.cos(beta)*(radius+5) ,nodeO.position_Y + Math.sin(beta) * (radius+5));
            ct.lineTo(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5);
            drawTriangleLT(nodeT.position_X - Math.sin(alpha) *(radius+5)*0.5,nodeT.position_Y  - Math.cos(alpha) * (radius+5)*0.5,alpha,beta)
            ct.translate((nodeO.position_X+nodeT.position_X)/2,(nodeO.position_Y+nodeT.position_Y)/2);
            ct.rotate(-(alpha-Math.PI/2));
            ct.fillText("支付("+pay+")",0,0);
            ct.rotate(alpha-Math.PI/2);
            ct.translate(-(nodeO.position_X+nodeT.position_X)/2,-(nodeO.position_Y+nodeT.position_Y)/2);
        }

        ct.stroke();
        ct.fill();
        ct.lineWidth = 5;
    }
//绘制图形
    function drawing(nodes,links,centerNodes){
        ct.clearRect(0,0,c.width,c.height);
        setTitle();
        ct.fillText("政企支付关系网络",c.width/2,40);
        for(let i=0;i<nodes.length;i++){
            if(checkPoint(i,nodes,centerNodes)){
                drawingC(nodes[i].position_X,nodes[i].position_Y,nodes[i].radius,nodes[i].lineWidth,i,nodes);
            } else{
                drawingN(nodes[i].position_X,nodes[i].position_Y,nodes[i].radius,nodes[i].lineWidth,i,nodes);
            }
        }
        for(let i=0;i<nodes.length;i++){
            for(let j=0;j<links.length;j++){
                let id= links[j].id.split('-');
                let idF = id[0];
                let idL = id[2];
                let linkPay = links[j].count;
                let flag_line = -1;
                if(nodes[i].id.toString() == idF){
                    // console.log("是否是中心点");
                    for(let k=0;k<nodes.length;k++){
                        if(nodes[k].id.toString() == idL){
                            flag_line = k;
                        }
                    }
                    // console.log(flag_line);
                    if(flag_line>-1){
                        drawLine(nodes[i],nodes[flag_line],linkPay);
                    }
                }
            }
        }
        ct.fillStyle='red';
    }











