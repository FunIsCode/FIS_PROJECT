var socket = io.connect('{{Host}}:{{SocketPort1}}');
			var RTU = io.connect('{{Host}}:{{SocketPort2}}');
			
			var	ZonesPresence = [[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0],
								[0,0,0,0,0]];
			var	RFIDIndication = [0,0,0,0,0,0,0,0,0,0,0,0];
			var	StopperIndication = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]];
			var	PalletState =  [[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],   // [WS][Zone][Parts(0:empty, 1:red, 2:Green, 3:Blue)], Parts : pallet, Paper, Frame, Screen, Keyboard, PalletID , Recipe
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
								[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]];
			var	WS_State = [[0,0,0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]; //[Conveyor(BUSY/IDLE),Robot(BUSY/IDLE)] for WS1 [Conveyor(BUSY/IDLE),Robot(BUSY/IDLE),Inconv,outConv]
			var PalletState_Res = [{{PalletState}}];
			var ZonesPresence_Res = [{{ZonesPresence}}];
			var RFIDIndication = [{{RFIDIndication}}];
			var StopperIndication_Res = [{{StopperIndication}}];
			var WS_State_Res = [{{WS_State}}];
			var InkoveMethod = [{{InkoveMethod}}];
			var PenColor = ["-1","-1","-1","-1","-1","-1","-1","-1","-1","-1","-1","-1"];
			for(var i =0; i<12;i++)
			{
				for(var j =0; j<5;j++)
				{
					ZonesPresence[i][j] = ZonesPresence_Res[(5*i)+j];
				}	
				for(var j =0; j<4;j++)
				{
					StopperIndication[i][j] = StopperIndication_Res[(4*i)+j];
					for(var k =0; k<5;k++)
					{
						PalletState[i][j][k] = PalletState_Res[(20*i)+(5*j)+k];
					}
				}
			}
			for(var i =1; i<12;i++)
			{
				for(var j =0; j<2;j++)
				{
					WS_State[i][j] = WS_State_Res[(2*(i-1))+j+4];
				}
			}
			
			function RadioChecked(msg)
			{
				if(msg == 'Local'){InkoveMethod = 0;}
				else if(msg == 'REST'){InkoveMethod = 1;} 
			}
			
			WS_State[0][0] = WS_State_Res[0];
			WS_State[0][1] = WS_State_Res[1];
			WS_State[0][2] = WS_State_Res[2];
			WS_State[0][3] = WS_State_Res[3];
			
			setInterval(function(){
				for (var i = 0; i<12;i++)
				{
					for (var j = 0; j<4;j++)
					{
						if (PalletState[i][j][0] == 0){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Pallet").css({'visibility' : 'hidden'});}
						if (PalletState[i][j][0] == 1){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Pallet").css({'visibility' : 'visible'});}
						if (PalletState[i][j][1] == 0){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Paper").css({'visibility' : 'hidden'});}
						if (PalletState[i][j][1] == 1){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Paper").css({'visibility' : 'visible'});}
						if (PalletState[i][j][2] == 0){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Cover").css({'fill':'#000000','visibility' : 'hidden'});}
						if (PalletState[i][j][2] == 1){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Cover").css({'fill':'#ff0000','visibility' : 'visible'});}
						if (PalletState[i][j][2] == 2){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Cover").css({'fill':'#00ff00','visibility' : 'visible'});}
						if (PalletState[i][j][2] == 3){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Cover").css({'fill':'#0000ff','visibility' : 'visible'});}
						if (PalletState[i][j][3] == 0){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Screen").css({'fill':'#000000','visibility' : 'hidden'});}
						if (PalletState[i][j][3] == 1){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Screen").css({'fill':'#ff0000','visibility' : 'visible'});}
						if (PalletState[i][j][3] == 2){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Screen").css({'fill':'#00ff00','visibility' : 'visible'});}
						if (PalletState[i][j][3] == 3){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Screen").css({'fill':'#0000ff','visibility' : 'visible'});}
						if (PalletState[i][j][4] == 0){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Keyboard").css({'fill':'#000000','visibility' : 'hidden'});}
						if (PalletState[i][j][4] == 1){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Keyboard").css({'fill':'#ff0000','visibility' : 'visible'});}
						if (PalletState[i][j][4] == 2){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Keyboard").css({'fill':'#00ff00','visibility' : 'visible'});}
						if (PalletState[i][j][4] == 3){$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Keyboard").css({'fill':'#0000ff','visibility' : 'visible'});}	
						if (ZonesPresence[i][j] == 0)
						{
							$("#WS"+(i+1)+"_Sensor"+(j+1)).css("fill","#ffffff");
							//$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Pallet").css("visibility", "hidden");
						}
						else
						{
							$("#WS"+(i+1)+"_Sensor"+(j+1)).css("fill","#ff7700");
							//$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Pallet").css("visibility", "visible");
						}
						if (StopperIndication[i][j] == 0){$("#WS"+(i+1)+"_Stopper"+(j+1)).css("fill","#ffffff");}
						else{$("#WS"+(i+1)+"_Stopper"+(j+1)).css("fill","#ff0000");}
					}
					if (ZonesPresence[i][4] == 0){$("#WS"+(i+2)+"_Sensor1").css("fill","#ffffff");}
					else{$("#WS"+(i+2)+"_Sensor1").css("fill","#ff7700");}
					if (RFIDIndication[i] == 0){$("#WS"+(i+1)+"_RFSensor").css("fill","#ffffff");}
					else{$("#WS"+(i+1)+"_RFSensor").css("fill","#0000ff");}
					if(WS_State[i][0]== 1){$("#WS"+(i+1)+"_ConveyorState").text("Conveyor:BUSY");}
					else{$("#WS"+(i+1)+"_ConveyorState").text("Conveyor:IDLE");}
					if(WS_State[i][1]== 1){$("#WS"+(i+1)+"_RobotState").text("Robot:BUSY");}
					else{$("#WS"+(i+1)+"_RobotState").text("Robot:IDLE");}
				}
				for(var i = 0;i<12;i++)
				{	
					if(PenColor[i] == -1)
					{
						$("#WS"+(i+1)+"_Joint2").css("fill","#ff7f00")
					}
					else if(PenColor[i] == "RED")
					{
						$("#WS"+(i+1)+"_Joint2").css("fill","#ff0000")
					}
					else if(PenColor[i] == "GREEN")
					{
						$("#WS"+(i+1)+"_Joint2").css("fill","#00ff00")
					}
					else if(PenColor[i] == "BLUE")
					{
						$("#WS"+(i+1)+"_Joint2").css("fill","#0000ff")
					}
				}
				// Sending Params to server
				var Params = {ZonesPresence: ZonesPresence,RFIDIndication:RFIDIndication,StopperIndication:StopperIndication,PalletState:PalletState,WS_State:WS_State,InkoveMethod:InkoveMethod };
				socket.emit('Params',Params );
			},200);

			// RTU
			RTU.on('Process', function (data) {
			console.log(data);
				switch(data.Process)
				{
					case 'Draw':Draw(data);
					break;
					case 'TransZone':WS_TransZone(data);
					break;
					case 'LoadPaper':LoadPaper(data);
					break;
					case 'UnloadPaper':UnloadPaper(data);
					break;
					case 'LoadPallet':LoadPallet(data);
					break;
					case 'UnloadPallet':UnloadPallet(data);
					break;
					case 'ResetSim':ResetSim(data);
					break;
					case 'ChangeColourRED':ChangePen(data)
					break;
					case 'ChangeColourGREEN':ChangePen(data)
					break;
					case 'ChangeColourBLUE':ChangePen(data)
					break;
					
				}
			});
			RTU.on('Data', function (data) {
			});
			
			function Int_post(path, params) 
			{
				var form = document.createElement("form");
				form.setAttribute("method", "post");
				form.setAttribute("action", path);

				for(var key in params) 
				{
					if(params.hasOwnProperty(key)) {
						var hiddenField = document.createElement("input");
						hiddenField.setAttribute("type", "hidden");
						hiddenField.setAttribute("name", key);
						hiddenField.setAttribute("value", params[key]);
						form.appendChild(hiddenField);
					}
				}
				document.body.appendChild(form);
				form.submit();
				return;
}
			
			function ResetSim(Args)
			{	
				RTU.emit('Notification',{req:'ResetSim'});
				for (var i = 0; i<12;i++)
				{
					RFIDIndication [i] = 0;
					for (var j = 0;j<5;j++)
					{
						ZonesPresence[i][j] = 0;
					}
					for (var j = 0;j<4;j++)
					{
						StopperIndication[i][j] = 1;
						for (var k = 0;k<5;k++)
						{
							PalletState[i][j][k] = 0;
						}
					}
					for (var j = 0;j<2;j++)
					{
						WS_State[i][j] = 0;
					}
					WS_State[0][2]=0;
					WS_State[0][3]=0;
				}
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
			}
			
			function ChangePen(Args)
			{
				PenColor[parseInt(Args.WS)-1] = Args.Color;
				args = {MSG:'PenChanged',WS:Args.WS,Color:Args.Color, destURL:Args.destURL};
				RTU.emit('Event',args );
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
			}
			
			
			function LoadPallet(Args)
			{
				var d = new Date();
				var palletid = d.getTime();
				args = {MSG:'RobotStartLoading',WS:'7',PalletID:palletid};
				console.log(palletid)
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'7',State:'BUSY'};
				RTU.emit('Notification',args);
				ZonesPresence[6][2] = 1;
				PalletState[6][2][0] = 1;
				PalletState[6][2][1] = 0;
				PalletState[6][2][2] = 0;
				PalletState[6][2][3] = 0;
				PalletState[6][2][4] = 0;
				PalletState[6][2][5] = palletid;
				PalletState[6][2][6] = 0;
				args = {MSG:'PalletLoaded',WS:'7',PalletID:palletid};
				RTU.emit('Event',args );
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'7',State:'IDLE'};
				RTU.emit('Notification',args);
			}
			
			function UnloadPallet(Args)
			{
				args = {MSG:'RobotStartUnloading',WS:'7',PalletID:Args.palletid};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'7',State:'BUSY'};
				RTU.emit('Notification',args);
				ZonesPresence[6][2] = 0;
				PalletState[6][2][0] = 0;
				PalletState[6][2][1] = 0;
				PalletState[6][2][2] = 0;
				PalletState[6][2][3] = 0;
				PalletState[6][2][4] = 0;
				PalletState[6][2][5] = 0;
				PalletState[6][2][6] = 0;
				args = {MSG:'PalletUnloaded',WS:'7',PalletID:Args.palletid};
				RTU.emit('Event',args );
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'7',State:'IDLE'};
				RTU.emit('Notification',args);
			}	
			
			function WS_TransZone(data)
			{	
			console.log(data)
				WS_State[parseInt(data.WS)-1][0]= 1;
				args = {Msg:'ConveyorStartTransferring',WS:data.WS,From:data.FromZone, To:data.ToZone, PalletID:PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][5],ServiceID : data.ServiceID};
				RTU.emit('Event',args );
				args = {Msg:'ConveyorChangeState',WS:data.WS,State:'BUSY',ServiceID:data.ServiceID};
				RTU.emit('Notification',args);
				switch(data.FromZone+data.ToZone)
				{	
					case'14':
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_MC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_MC4").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#ff0000");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC2").css("stroke","#00ff00");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						RFIDIndication[parseInt(data.WS)-1] = 0;
						StopperIndication[parseInt(data.WS)-1][0] = 0;
						if (data.WS=='1')
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[11][4] = 0;
						}
						else
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
					case'45':
						if(data.WS == '6')
						{
							$("#WS"+String(parseInt(data.WS)+1)+"_MC1").css("stroke","#00ff00");
							$("#WS"+String(parseInt(data.WS)+1)+"_MC2").css("stroke","#00ff00");
						}
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_MC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_MC4").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#ff0000");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_CC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_CC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC2").css("stroke","#00ff00");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						ZonesPresence[parseInt(data.WS)-1][3] = 0;
						StopperIndication[parseInt(data.WS)-1][3] = 0;
						break;
					case'12':
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+data.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_JC2").css("stroke","#bcbcbc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						RFIDIndication[parseInt(data.WS)-1] = 0;
						StopperIndication[parseInt(data.WS)-1][0] = 0;
						if (data.WS=='1')
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[11][4] = 0;
						}
						else
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
					case'13':
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+data.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_JC2").css("stroke","#bcbcbc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						RFIDIndication[parseInt(data.WS)-1] = 0;
						StopperIndication[parseInt(data.WS)-1][0] = 0;
						StopperIndication[parseInt(data.WS)-1][1] = 0;
						if (data.WS=='1')
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[11][4] = 0;
						}
						else
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
					case'15':
						if(data.WS == '6')
						{
							$("#WS"+String(parseInt(data.WS)+1)+"_MC1").css("stroke","#00ff00");
							$("#WS"+String(parseInt(data.WS)+1)+"_MC2").css("stroke","#00ff00");
						}
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+data.WS+"_CC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_CC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_JC2").css("stroke","#bcbcbc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						RFIDIndication[parseInt(data.WS)-1] = 0;
						StopperIndication[parseInt(data.WS)-1][0] = 0;
						StopperIndication[parseInt(data.WS)-1][1] = 0;
						StopperIndication[parseInt(data.WS)-1][2] = 0;
						if (data.WS=='1')
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[11][4] = 0;
						}
						else
						{
							ZonesPresence[parseInt(data.WS)-1][0] = 0;
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
					case'23':
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+data.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_JC2").css("stroke","#bcbcbc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						ZonesPresence[parseInt(data.WS)-1][1] = 0;
						StopperIndication[parseInt(data.WS)-1][1] = 0;
						if(data.WS == '7')
						{
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
					case'25':
						if(data.WS == '6')
						{
							$("#WS"+String(parseInt(data.WS)+1)+"_MC1").css("stroke","#00ff00");
							$("#WS"+String(parseInt(data.WS)+1)+"_MC2").css("stroke","#00ff00");
						}
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+data.WS+"_CC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_CC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_JC2").css("stroke","#bcbcbc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						ZonesPresence[parseInt(data.WS)-1][1] = 0;
						StopperIndication[parseInt(data.WS)-1][1] = 0;
						StopperIndication[parseInt(data.WS)-1][2] = 0;
						if(data.WS == '7')
						{
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
					case'35':
						if(data.WS == '6')
						{
							$("#WS"+String(parseInt(data.WS)+1)+"_MC1").css("stroke","#00ff00");
							$("#WS"+String(parseInt(data.WS)+1)+"_MC2").css("stroke","#00ff00");
						}
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC3").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC4").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC5").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC6").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC7").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC8").css("stroke","#00ff00");
						$("#WS"+data.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+data.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+data.WS+"_CC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_CC2").css("stroke","#00ff00");
						$("#WS"+data.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+data.WS+"_JC2").css("stroke","#bcbcbc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						ZonesPresence[parseInt(data.WS)-1][2] = 0;
						StopperIndication[parseInt(data.WS)-1][2] = 0;
						if(data.WS == '7')
						{
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						}
						break;
				}
				Animate_Pallet(data);		
			}
			
			function LoadPaper(Args)
			{
				args = {MSG:'RobotStartLoading',WS:'1',PalletID:Args.PalletID};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'1',State:'BUSY'};
				RTU.emit('Notification',args);
				WS_State[0][1]=1;
				document.getElementById('WS1_RobotLoad').beginElement();
				setTimeout(function(){
					PalletState[0][2][1] = 1;
					WS_State[0][2]=1;
				},4000);
				setTimeout(function(){WS_State[0][1]=0;},4500);
				setTimeout(function(){
					WS_State[0][2]=0;
				args = {MSG:'PaperLoaded',WS:'1',PalletID:Args.PalletID};
					RTU.emit('Event',args );
					
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				
					args = {Msg:'RobotChangeState',WS:'1',State:'IDLE'};
					RTU.emit('Notification',args);
				},6000);
			}
			
			function UnloadPaper(Args)
			{
				WS_State[0][1]=1;
				args = {Msg:'RobotStartUnloading',WS:'1',PalletID:Args.PalletID};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'1',State:'BUSY'};
				RTU.emit('Notification',args);
				document.getElementById('WS1_RobotUnload').beginElement();
				setTimeout(function(){
					PalletState[0][3][1] = PalletState[0][2][1];
					PalletState[0][3][2] = PalletState[0][2][2];
					PalletState[0][3][3] = PalletState[0][2][3];
					PalletState[0][3][4] = PalletState[0][2][4];
					PalletState[0][2][1] = 0;
					PalletState[0][2][2] = 0;
					PalletState[0][2][3] = 0;
					PalletState[0][2][4] = 0;
					document.getElementById('WS2_PalletReturn').beginElement();
				},2000);
				setTimeout(function(){
					WS_State[0][1]=0;
					WS_State[0][3]=1;
				},4000);
				setTimeout(function(){
					PalletState[0][3][1] = 0;
					PalletState[0][3][2] = 0;
					PalletState[0][3][3] = 0;
					PalletState[0][3][4] = 0;
					WS_State[0][3]=0;
					args = {MSG:'PaperUnloaded',WS:'1',PalletID:Args.PalletID};
					RTU.emit('Event',args );
					
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				
					args = {Msg:'RobotChangeState',WS:'1',State:'IDLE'};
					RTU.emit('Notification',args);
				},6000);
			}

			function Animate_Pallet(Args) {
				document.getElementById('WS'+Args.WS+'_Zone'+String(Args.FromZone)+String(Args.ToZone)).beginElement();
				var TimeOutVal;
				if (Args.WS=='6')
				{
					switch(String(Args.FromZone)+String(Args.ToZone))
					{
						case '12':
							TimeOutVal = 0.8;
							break;
						case '13':
							TimeOutVal = 1.44;
							break;
						case '14':
							TimeOutVal = 1.46;
							break;
						case '15':
							TimeOutVal = 4.03;
							break;
						case '23':
							TimeOutVal = 0.6;
							break;
						case '25':
							TimeOutVal = 2.57;
							break;
						case '35':
							TimeOutVal = 2.23;
							break;
						case '45':
							TimeOutVal = 1.96;
							break;
					}
				}
				else if(Args.WS=='1'||Args.WS=='7'||Args.WS=='12')
				{
					switch(String(Args.FromZone)+String(Args.ToZone))
					{
						case '12':
							TimeOutVal = 0.8;
							break;
						case '13':
							TimeOutVal = 1.44;
							break;
						case '14':
							TimeOutVal = 1.46;
							break;
						case '15':
							TimeOutVal = 3.46;
							break;
						case '23':
							TimeOutVal = 0.6;
							break;
						case '25':
							TimeOutVal = 2;
							break;
						case '35':
							TimeOutVal = 1.66;
							break;
						case '45':
							TimeOutVal = 1.39;
							break;
					}
				}
				else
				{
					switch(String(Args.FromZone)+String(Args.ToZone))
					{
						case '12':
							TimeOutVal = 0.8;
							break;
						case '13':
							TimeOutVal = 1.44;
							break;
						case '14':
							TimeOutVal = 1.46;
							break;
						case '15':
							TimeOutVal = 3;
							break;
						case '23':
							TimeOutVal = 0.6;
							break;
						case '25':
							TimeOutVal = 1.54;
							break;
						case '35':
							TimeOutVal = 1.2;
							break;
						case '45':
							TimeOutVal = 0.93;
							break;
					
					}
				}
				setTimeout(function(){ 
				// When Reach the final location
				
						if(Args.WS == '6')
						{
							$("#WS"+String(parseInt(Args.WS)+1)+"_MC1").css("stroke","#ff0000");
							$("#WS"+String(parseInt(Args.WS)+1)+"_MC2").css("stroke","#ff0000");
						}
						$("#WS"+Args.WS+"_MC1").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC2").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC3").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC4").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC5").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC6").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC7").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_MC8").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_BC1").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_BC2").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_BC3").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_BC4").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_BC5").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_BC6").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_JC1").css("stroke","#bcbcbc");
						$("#WS"+Args.WS+"_JC2").css("stroke","#bcbcbc");
						$("#WS"+Args.WS+"_CC1").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_CC2").css("stroke","#ff0000");
				switch(String(Args.FromZone)+String(Args.ToZone))
				{
					case'14':
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][3] = 1;
						StopperIndication[parseInt(Args.WS)-1][0] = 1;
						break;
						
					case'45':
						if(Args.WS=='12')
						{
							PalletState[0][0][0] = 1;
							ZonesPresence[0][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[0] = 1;
						}
						else if(Args.WS=='6')
						{
							PalletState[6][1][0] = 1;
							ZonesPresence[parseInt(Args.WS)][1] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
						}
						else
						{
							PalletState[parseInt(Args.WS)][0][0] = 1;
							ZonesPresence[parseInt(Args.WS)][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[parseInt(Args.WS)] = 1;
						}
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						StopperIndication[parseInt(Args.WS)-1][3] = 1;
						break;
						
					case'12':
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][1] = 1;
						StopperIndication[parseInt(Args.WS)-1][0] = 1;
						break;
					case'13':
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][2] = 1;
						StopperIndication[parseInt(Args.WS)-1][0] = 1;
						StopperIndication[parseInt(Args.WS)-1][1] = 1;
						break;
					case'15':
						if(Args.WS=='12')
						{
							PalletState[0][0][0] = 1;
							ZonesPresence[0][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[0] = 1;
						}
						else if(Args.WS=='6')
						{
							PalletState[6][1][0] = 1;
							ZonesPresence[parseInt(Args.WS)][1] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
						}
						else
						{
							PalletState[parseInt(Args.WS)][0][0] = 1;
							ZonesPresence[parseInt(Args.WS)][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[parseInt(Args.WS)] = 1;
						}
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						StopperIndication[parseInt(Args.WS)-1][0] = 1;
						StopperIndication[parseInt(Args.WS)-1][1] = 1;
						StopperIndication[parseInt(Args.WS)-1][2] = 1;
						break;
					case'23':
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][2] = 1;
						StopperIndication[parseInt(Args.WS)-1][1] = 1;
						break;
					case'25':
						if(Args.WS=='12')
						{
							PalletState[0][0][0] = 1;
							ZonesPresence[0][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[0] = 1;
						}
						else if(Args.WS=='6')
						{
							PalletState[6][1][0] = 1;
							ZonesPresence[parseInt(Args.WS)][1] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
						}
						else
						{
							PalletState[parseInt(Args.WS)][0][0] = 1;
							ZonesPresence[parseInt(Args.WS)][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[parseInt(Args.WS)] = 1;
						}
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						StopperIndication[parseInt(Args.WS)-1][1] = 1;
						StopperIndication[parseInt(Args.WS)-1][2] = 1;
						break;
					case'35':
						if(Args.WS=='12')
						{
							PalletState[0][0][0] = 1;
							ZonesPresence[0][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[0] = 1;
						}
						else if(Args.WS=='6')
						{
							PalletState[6][1][0] = 1;
							ZonesPresence[6][1] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
						}
						else
						{
						PalletState[parseInt(Args.WS)][0][0] = 1;
						ZonesPresence[parseInt(Args.WS)][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][4] = 1;
						RFIDIndication[parseInt(Args.WS)] = 1;
						}
						PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;
						StopperIndication[parseInt(Args.WS)-1][2] = 1;
						
						break;
				}
				for (var i = 1; i<7;i++ )
				{
					if((Args.WS=='1'||Args.WS=='7') && (Args.ToZone == '5'))
					{
						PalletState[parseInt(Args.WS)][0][i]=PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i];
					}
					else if (Args.WS=='12' && Args.ToZone == '5')
					{	
						PalletState[0][0][i]=PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i];
					}
					else if(Args.WS=='6' && Args.ToZone == '5' )
					{
						PalletState[parseInt(Args.WS)][1][i]=PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i];
					}
					else if (Args.ToZone == '5')
					{
						PalletState[parseInt(Args.WS)][0][i]=PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i];
					}
					else
					{
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][i]=PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i];
					}
				}
				for (var i = 1; i<5;i++ ){PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i]=0;}
				WS_State[parseInt(Args.WS)-1][0]= 0;
				args = {Msg:'ConveyorStopTransferring',WS:Args.WS,From:Args.FromZone, To:Args.ToZone, PalletID:PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][5],ServiceID:Args.ServiceID};
				RTU.emit('Event',args );
					
				args = {MSG:'OpreationFinished',destURL:Args.destURL,ServiceID:Args.ServiceID};
				RTU.emit('Event',args );
				
				args = {Msg:'ConveyorChangeState',WS:Args.WS,State:'IDLE'};
				RTU.emit('Notification',args);
				}, TimeOutVal*1000);				
			}
			function Draw(Args)
			{
				WS_State[parseInt(Args.WS)-1][1]= 1;
				args = {MSG:'RobotStartDrawing',WS:Args.WS,PalletID:Args.PalletID,Recipe:Args.Recipe};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:Args.WS,State:'Busy'};
				RTU.emit('Notification',args);
				document.getElementById('WS'+Args.WS+'_Robot1').beginElement();
					setTimeout(function(){
						PalletState[parseInt(Args.WS)-1][2][parseInt(Args.OP)+1] = parseInt(Args.Color);
					},2000);
					setTimeout(function(){
						WS_State[parseInt(Args.WS)-1][1]= 0;
						args = {MSG:'RobotStopDrawing',WS:Args.WS,PalletID:Args.PalletID,Recipe:Args.Recipe};
						RTU.emit('Event',args );
					
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				
				
						args = {Msg:'RobotChangeState',WS:Args.WS,State:'IDLE'};
						RTU.emit('Notification',args);
					},4000);
					
			}
		
			$(document).ready(function(){
			{
				$("#WS1_Button12").click(function(){
					//var data = {"WS":"1", "Operation":"TransZone","FromZone":"1", "ToZone":"2","PalletID":PalletState[][][5],"TransID":"456"};
					//if (InkoveMethod == 0){WS_TransZone(data);}
					//else{Int_post('http://130.230.141.228:3000/RTU/CNV1/process/transzone', data); }
					var data = {"WS":"1", "Operation":"TransZone","FromZone":"1", "ToZone":"2","PalletID":PalletState[0][0][5],"TransID":"456"};
					WS_TransZone(data);
				});
				$("#WS1_Button13").click(function(){
					var data = {"WS":"1", "Operation":"TransZone","FromZone":"1", "ToZone":"3","PalletID":PalletState[0][0][5],"TransID":"456"};
					WS_TransZone(data);
				});
				$("#WS1_Button15").click(function(){
					var data = {"WS":"1", "Operation":"TransZone","FromZone":"1", "ToZone":"5","PalletID":PalletState[0][0][5],"TransID":"456"};
					WS_TransZone(data);
				});
				$("#WS1_Button23").click(function(){
					var data = {"WS":"1", "Operation":"TransZone","FromZone":"2", "ToZone":"3","PalletID":PalletState[0][1][5],"TransID":"456"};
					WS_TransZone(data);
				});
				$("#WS1_Button25").click(function(){
					var data = {"WS":"1", "Operation":"TransZone","FromZone":"2", "ToZone":"5","PalletID":PalletState[0][1][5],"TransID":"456"};
					WS_TransZone(data);
				});
				$("#WS1_ButtonLoad").click(function(){
					LoadPaper(PalletState[0][2][5]);
				});
				$("#WS1_ButtonUnload").click(function(){
					UnloadPaper(PalletState[0][2][5]);
				});
				$("#WS1_Button35").click(function(){
				var data = {"WS":"1", "Operation":"TransZone","FromZone":"3", "ToZone":"5","PalletID":PalletState[0][2][5],"TransID":"456"};
				WS_TransZone(data);
				});
				
				$("#WS2_Button12").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"1", "ToZone":"2","PalletID":PalletState[1][0][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button13").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"1", "ToZone":"3","PalletID":PalletState[1][0][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button14").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"1", "ToZone":"4","PalletID":PalletState[1][0][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button15").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"1", "ToZone":"5","PalletID":PalletState[1][0][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button23").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"2", "ToZone":"3","PalletID":PalletState[1][1][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button25").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"2", "ToZone":"5","PalletID":PalletState[1][1][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button35").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"3", "ToZone":"5","PalletID":PalletState[1][2][5],"TransID":"456"};
				WS_TransZone(data);
				});
				$("#WS2_Button45").click(function(){
				var data = {"WS":"2", "Operation":"TransZone","FromZone":"4", "ToZone":"5","PalletID":PalletState[1][3][5],"TransID":"456"};
				WS_TransZone(data);
				});

				$("#WS3_Button12").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[2][0][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button13").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[2][0][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button14").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[2][0][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button15").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[2][0][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button23").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[2][1][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button25").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[2][1][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button35").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[2][2][5]}
					WS_TransZone(data);
				});
				$("#WS3_Button45").click(function(){
				var data = {"WS":"3","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[2][3][5]}
					WS_TransZone(data);
				});

				$("#WS4_Button12").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[3][0][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button13").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[3][0][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button14").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[3][0][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button15").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[3][0][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button23").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[3][1][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button25").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[3][1][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button35").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[3][2][5]}
					WS_TransZone(data);
				});
				$("#WS4_Button45").click(function(){
				var data = {"WS":"4","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[3][3][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button12").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[4][0][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button13").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[4][0][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button14").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[4][0][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button15").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[4][0][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button23").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[4][1][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button25").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[4][1][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button35").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[4][2][5]}
					WS_TransZone(data);
				});
				$("#WS5_Button45").click(function(){
				var data = {"WS":"5","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[4][3][5]}
					WS_TransZone(data);
				});

				$("#WS6_Button12").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[5][0][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button13").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[5][0][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button14").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[5][0][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button15").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[5][0][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button23").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[5][1][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button25").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[5][1][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button35").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[5][2][5]}
					WS_TransZone(data);
				});
				$("#WS6_Button45").click(function(){
				var data = {"WS":"6","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[5][3][5]}
					WS_TransZone(data);
				});
				
				$("#WS7_Button23").click(function(){
				var data = {"WS":"7","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[6][1][5]}
					WS_TransZone(data);
				});
				$("#WS7_Button25").click(function(){
				var data = {"WS":"7","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[6][1][5]}
					WS_TransZone(data);
				});
				$("#WS7_Button35").click(function(){
				var data = {"WS":"7","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[6][2][5]}
					WS_TransZone(data);
				});
				
				$("#WS7_ButtonLoad").click(function(){
					LoadPallet();
					
				});
				$("#WS7_ButtonStore").click(function(){
					UnloadPallet(PalletState[6][2][5]);
				});
				
				$("#WS8_Button12").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[7][0][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button13").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[7][0][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button14").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[7][0][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button15").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[7][0][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button25").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[7][1][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button23").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[7][1][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button35").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[7][2][5]}
					WS_TransZone(data);
				});
				$("#WS8_Button45").click(function(){
				var data = {"WS":"8","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[7][3][5]}
					WS_TransZone(data);
				});
				
				$("#WS9_Button12").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[8][0][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button13").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[8][0][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button14").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[8][0][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button15").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[8][0][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button25").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[8][1][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button23").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[8][1][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button35").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[8][2][5]}
					WS_TransZone(data);
				});
				$("#WS9_Button45").click(function(){
				var data = {"WS":"9","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[8][3][5]}
					WS_TransZone(data);
				});
				
				$("#WS10_Button12").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[9][0][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button13").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[9][0][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button14").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[9][0][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button15").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[9][0][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button25").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[9][1][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button23").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[9][1][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button35").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[9][2][5]}
					WS_TransZone(data);
				});
				$("#WS10_Button45").click(function(){
				var data = {"WS":"10","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[9][3][5]}
					WS_TransZone(data);
				});
				
				$("#WS11_Button12").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[10][0][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button13").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[10][0][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button14").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[10][0][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button15").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[10][0][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button25").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[10][1][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button23").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[10][1][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button35").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[10][2][5]}
					WS_TransZone(data);
				});
				$("#WS11_Button45").click(function(){
				var data = {"WS":"11","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[10][3][5]}
					WS_TransZone(data);
				});
				
				$("#WS12_Button12").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"1","ToZone":"2","PalletID":PalletState[11][0][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button13").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"1","ToZone":"3","PalletID":PalletState[11][0][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button14").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"1","ToZone":"4","PalletID":PalletState[11][0][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button15").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"1","ToZone":"5","PalletID":PalletState[11][0][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button25").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"2","ToZone":"5","PalletID":PalletState[11][1][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button23").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"2","ToZone":"3","PalletID":PalletState[11][1][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button35").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"3","ToZone":"5","PalletID":PalletState[11][2][5]}
					WS_TransZone(data);
				});
				$("#WS12_Button45").click(function(){
				var data = {"WS":"12","Operation":"TransZone","FromZone":"4","ToZone":"5","PalletID":PalletState[11][3][5]}
					WS_TransZone(data);
				});
			}	
			{	$("#WS12_ButtonCR").click(function(){
					Args={WS:'12',OP:1,Color:1,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonSR").click(function(){
					Args={WS:'12',OP:2,Color:1,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonKR").click(function(){
					Args={WS:'12',OP:3,Color:1,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonCG").click(function(){
					Args={WS:'12',OP:1,Color:2,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonSG").click(function(){
					Args={WS:'12',OP:2,Color:2,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonKG").click(function(){
					Args={WS:'12',OP:3,Color:2,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonCB").click(function(){
					Args={WS:'12',OP:1,Color:3,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonSB").click(function(){
					Args={WS:'12',OP:2,Color:3,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
				$("#WS12_ButtonKB").click(function(){
					Args={WS:'12',OP:3,Color:3,PalletID : PalletState[11][2][5]};
					Draw(Args);
				});
		
				$("#WS11_ButtonCR").click(function(){
					Args={WS:'11',OP:1,Color:1,PalletID : PalletState[10][2][5]};
					Draw(Args);
					
				});
				$("#WS11_ButtonSR").click(function(){
					Args={WS:'11',OP:2,Color:1,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonKR").click(function(){
					Args={WS:'11',OP:3,Color:1,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonCG").click(function(){
					Args={WS:'11',OP:1,Color:2,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonSG").click(function(){
					Args={WS:'11',OP:2,Color:2,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonKG").click(function(){
					Args={WS:'11',OP:3,Color:2,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonCB").click(function(){
					Args={WS:'11',OP:1,Color:3,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonSB").click(function(){
					Args={WS:'11',OP:2,Color:3,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
				$("#WS11_ButtonKB").click(function(){
					Args={WS:'11',OP:3,Color:3,PalletID : PalletState[10][2][5]};
					Draw(Args);
				});
			
				$("#WS10_ButtonCR").click(function(){
					Args={WS:'10',OP:1,Color:1,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonSR").click(function(){
					Args={WS:'10',OP:2,Color:1,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonKR").click(function(){
					Args={WS:'10',OP:3,Color:1,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonCG").click(function(){
					Args={WS:'10',OP:1,Color:2,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonSG").click(function(){
					Args={WS:'10',OP:2,Color:2,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonKG").click(function(){
					Args={WS:'10',OP:3,Color:2,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonCB").click(function(){
					Args={WS:'10',OP:1,Color:3,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonSB").click(function(){
					Args={WS:'10',OP:2,Color:3,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});
				$("#WS10_ButtonKB").click(function(){
					Args={WS:'10',OP:3,Color:3,PalletID : PalletState[9][2][5]};
					Draw(Args);
				});			
			
				$("#WS9_ButtonCR").click(function(){
					Args={WS:'9',OP:1,Color:1,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonSR").click(function(){
					Args={WS:'9',OP:2,Color:1,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonKR").click(function(){
					Args={WS:'9',OP:3,Color:1,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonCG").click(function(){
					Args={WS:'9',OP:1,Color:2,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonSG").click(function(){
					Args={WS:'9',OP:2,Color:2,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonKG").click(function(){
					Args={WS:'9',OP:3,Color:2,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonCB").click(function(){
					Args={WS:'9',OP:1,Color:3,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonSB").click(function(){
					Args={WS:'9',OP:2,Color:3,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});
				$("#WS9_ButtonKB").click(function(){
					Args={WS:'9',OP:3,Color:3,PalletID : PalletState[8][2][5]};
					Draw(Args);
				});		
			
				$("#WS8_ButtonCR").click(function(){
					Args={WS:'8',OP:1,Color:1,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonSR").click(function(){
					Args={WS:'8',OP:2,Color:1,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonKR").click(function(){
					Args={WS:'8',OP:3,Color:1,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonCG").click(function(){
					Args={WS:'8',OP:1,Color:2,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonSG").click(function(){
					Args={WS:'8',OP:2,Color:2,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonKG").click(function(){
					Args={WS:'8',OP:3,Color:2,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonCB").click(function(){
					Args={WS:'8',OP:1,Color:3,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonSB").click(function(){
					Args={WS:'8',OP:2,Color:3,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
				$("#WS8_ButtonKB").click(function(){
					Args={WS:'8',OP:3,Color:3,PalletID : PalletState[7][2][5]};
					Draw(Args);
				});
			
				$("#WS6_ButtonCR").click(function(){
					Args={WS:'6',OP:1,Color:1,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonSR").click(function(){
					Args={WS:'6',OP:2,Color:1,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonKR").click(function(){
					Args={WS:'6',OP:3,Color:1,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonCG").click(function(){
					Args={WS:'6',OP:1,Color:2,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonSG").click(function(){
					Args={WS:'6',OP:2,Color:2,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonKG").click(function(){
					Args={WS:'6',OP:3,Color:2,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonCB").click(function(){
					Args={WS:'6',OP:1,Color:3,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonSB").click(function(){
					Args={WS:'6',OP:2,Color:3,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
				$("#WS6_ButtonKB").click(function(){
					Args={WS:'6',OP:3,Color:3,PalletID : PalletState[5][2][5]};
					Draw(Args);
				});
			
				$("#WS5_ButtonCR").click(function(){
					Args={WS:'5',OP:1,Color:1,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonSR").click(function(){
					Args={WS:'5',OP:2,Color:1,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonKR").click(function(){
					Args={WS:'5',OP:3,Color:1,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonCG").click(function(){
					Args={WS:'5',OP:1,Color:2,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonSG").click(function(){
					Args={WS:'5',OP:2,Color:2,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonKG").click(function(){
					Args={WS:'5',OP:3,Color:2,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonCB").click(function(){
					Args={WS:'5',OP:1,Color:3,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonSB").click(function(){
					Args={WS:'5',OP:2,Color:3,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
				$("#WS5_ButtonKB").click(function(){
					Args={WS:'5',OP:3,Color:3,PalletID : PalletState[4][2][5]};
					Draw(Args);
				});
			
				$("#WS4_ButtonCR").click(function(){
					Args={WS:'4',OP:1,Color:1,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonSR").click(function(){
					Args={WS:'4',OP:2,Color:1,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonKR").click(function(){
					Args={WS:'4',OP:3,Color:1,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonCG").click(function(){
					Args={WS:'4',OP:1,Color:2,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonSG").click(function(){
					Args={WS:'4',OP:2,Color:2,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonKG").click(function(){
					Args={WS:'4',OP:3,Color:2,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonCB").click(function(){
					Args={WS:'4',OP:1,Color:3,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonSB").click(function(){
					Args={WS:'4',OP:2,Color:3,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
				$("#WS4_ButtonKB").click(function(){
					Args={WS:'4',OP:3,Color:3,PalletID : PalletState[3][2][5]};
					Draw(Args);
				});
			
				$("#WS3_ButtonCR").click(function(){
					Args={WS:'3',OP:1,Color:1,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonSR").click(function(){
					Args={WS:'3',OP:2,Color:1,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonKR").click(function(){
					Args={WS:'3',OP:3,Color:1,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonCG").click(function(){
					Args={WS:'3',OP:1,Color:2,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonSG").click(function(){
					Args={WS:'3',OP:2,Color:2,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonKG").click(function(){
					Args={WS:'3',OP:3,Color:2,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonCB").click(function(){
					Args={WS:'3',OP:1,Color:3,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonSB").click(function(){
					Args={WS:'3',OP:2,Color:3,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
				$("#WS3_ButtonKB").click(function(){
					Args={WS:'3',OP:3,Color:3,PalletID : PalletState[2][2][5]};
					Draw(Args);
				});
			
				$("#WS2_ButtonCR").click(function(){
					Args={WS:'2',OP:1,Color:1,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonSR").click(function(){
					Args={WS:'2',OP:2,Color:1,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonKR").click(function(){
					Args={WS:'2',OP:3,Color:1,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonCG").click(function(){
					Args={WS:'2',OP:1,Color:2,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonSG").click(function(){
					Args={WS:'2',OP:2,Color:2,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonKG").click(function(){
					Args={WS:'2',OP:3,Color:2,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonCB").click(function(){
					Args={WS:'2',OP:1,Color:3,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonSB").click(function(){
					Args={WS:'2',OP:2,Color:3,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
				$("#WS2_ButtonKB").click(function(){
					Args={WS:'2',OP:3,Color:3,PalletID : PalletState[1][2][5]};
					Draw(Args);
				});
			}
				$("#Reset").click(function(){
					ResetSim();
				});
			
			});