			var DateNow = new Date();
			var SerialNumber = DateNow.getTime();
			var BafferBase = SerialNumber-1;
			var BufferPallets = 
			{
				availablePallets : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				numAvailablePallets : 18,
				palletsIDs:[]
			};
			for(var i = 0;i<18;i++)
			{
				BufferPallets.palletsIDs[i]=SerialNumber+i;
			}
			
			var PenColor = ["NA","RED","RED","RED","RED","RED","NA","RED","RED","RED","RED","RED"];
			for(var i =0; i<12;i++)
			{
				for(var j =0; j<5;j++)
				{
					ZonesPresence[i][j] = ZonesPresence_Res[(5*i)+j];
				}	
				for(var j =0; j<4;j++)
				{
					StopperIndication[i][j] = StopperIndication_Res[(4*i)+j];
					for(var k =0; k<7;k++)
					{
						PalletState[i][j][k] = PalletState_Res[(28*i)+(7*j)+k];
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
							$("#WS"+(i+1)+"_Sensor"+(j+1)).attr("class","Presence_Sensor_OFF");
							//$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Pallet").css("visibility", "hidden");
						}
						else
						{
							$("#WS"+(i+1)+"_Sensor"+(j+1)).attr("class","Presence_Sensor_ON");
							//$("#WS"+(i+1)+"_PalletZone"+(j+1)+"_Pallet").css("visibility", "visible");
						}
						if (StopperIndication[i][j] == 0){$("#WS"+(i+1)+"_Stopper"+(j+1)).attr("class","Stopper_OFF");;}
						else{$("#WS"+(i+1)+"_Stopper"+(j+1)).attr("class","Stopper_ON");}
					}
					if (ZonesPresence[i][4] == 0){$("#WS"+(i+2)+"_Sensor1").attr("class","Presence_Sensor_OFF");}
					else{$("#WS"+(i+2)+"_Sensor1").attr("class","Presence_Sensor_ON");}
					if (RFIDIndication[i] == 0){$("#WS"+(i+1)+"_RFSensor").attr("class","RFID_Sensor_OFF");}
					else{$("#WS"+(i+1)+"_RFSensor").attr("class","RFID_Sensor_ON");}
					if(WS_State[i][0]== 1){$("#WS"+(i+1)+"_ConveyorState").text("Conveyor:BUSY");}
					else{$("#WS"+(i+1)+"_ConveyorState").text("Conveyor:IDLE");}
					if(WS_State[i][1]== 1){$("#WS"+(i+1)+"_RobotState").text("Robot:BUSY");}
					else{$("#WS"+(i+1)+"_RobotState").text("Robot:IDLE");}
				}
				for(var i = 0;i<12;i++)
				{	
					if(PenColor[i] == "NA")
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
				for(var i = 0; i<18;i++)
				{
					if(BufferPallets[i] == '-1')
					{
						$("#WS7_PalletBuffer"+(i+1)).css({'visibility' : 'hidden'});
					}
					else
					{
						$("#WS7_PalletBuffer"+(i+1)).css({'visibility' : 'visible'});
					}
				}
				// Sending Params to server
				var Params = {ZonesPresence: ZonesPresence,RFIDIndication:RFIDIndication,StopperIndication:StopperIndication,PalletState:PalletState,WS_State:WS_State,InkoveMethod:InkoveMethod };
				socket.emit('Params',Params );
				RTU.emit('Params',Params );
			},50);
			
			// RTU
			RTU.on('Process', function (data) {
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
					case 'ChangePenRED':ChangePen(data)
					break;
					case 'ChangePenGREEN':ChangePen(data)
					break;
					case 'ChangePenBLUE':ChangePen(data)
					break;
					
				}
			});
						
			
			function Refill(ID)
			{
				var num = ID.substring(2,ID.indexOf("_"));				
				var Elm = document.getElementById(ID);
				Elm.setAttribute("y","0");
				Elm.setAttribute("height","44");
				document.getElementById('WS'+num+'_YellowAlarm').setAttribute("visibility","hidden");									
				document.getElementById('WS'+num+'_RedAlarm').setAttribute("visibility","hidden");
			}
			
			function ResetSim(Args)
			{	
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
					if(i !=6 && i !=0)
					{
						Refill("WS"+String(i+1)+"_RedInk");
						Refill("WS"+String(i+1)+"_GreenInk");
						Refill("WS"+String(i+1)+"_BlueInk");
					}
				}
				PenColor = ["RED","RED","RED","RED","RED","RED","RED","RED","RED","RED","RED","RED"];
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				//history.go(0);
			}
			
			function ChangePen(Args)
			{
				PenColor[parseInt(Args.WS)-1] = Args.Color;
				args = {MSG:'PenChanged',WS:Args.WS,Color:Args.Color, destURL:Args.destURL,ServiceID : Args.ServiceID};
				RTU.emit('Event',args );
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
			}
			function LoadPallet(Args)
			{
				var d = new Date();
				var palletid = d.getTime();
				
				var tempID = BufferPallets.availablePallets.indexOf(1);
				if(tempID != -1){console.log('ok')}
				else{console.log('not ok')}
				var palletid = BufferPallets.palletsIDs[tempID];
				BufferPallets.availablePallets[tempID] = 0;
				BufferPallets.numAvailablePallets = BufferPallets.numAvailablePallets-1;
				
				args = {MSG:'PalletLoaded',WS:'7',PalletID:palletid,ServiceID : Args.ServiceID};
				RTU.emit('Event',args );
				
				args = {MSG:'PalletCountChanged',WS:'7',PalletAvailableNum:BufferPallets.numAvailablePallets};
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
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'7',State:'IDLE'};
				RTU.emit('Notification',args);
				
			}
			
			function UnloadPallet(Args)
			{
				var palletid = PalletState[6][2][5];
				args = {MSG:'PalletUnloaded',WS:'7',PalletID:palletid,ServiceID : Args.ServiceID};
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
				args = {MSG:'PalletUnloaded',WS:'7',PalletID:palletid,ServiceID : Args.ServiceID};
				RTU.emit('Event',args );
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				args = {Msg:'RobotChangeState',WS:'7',State:'IDLE'};
				RTU.emit('Notification',args);
				var tempID = BufferPallets.palletsIDs.indexOf(palletid);
				console.log(tempID)
				if(tempID != -1){console.log('ok')}
				else{console.log('not ok')}
				BufferPallets.availablePallets[tempID] = 1;
				BufferPallets.numAvailablePallets = BufferPallets.numAvailablePallets+1;
				
				args = {MSG:'PalletCountChanged',WS:'7',PalletAvailableNum:BufferPallets.numAvailablePallets};
				RTU.emit('Event',args );
			}	
			
			function WS_TransZone(data)
			{	
				//console.log(PalletState)
				WS_State[parseInt(data.WS)-1][0]= 1;
				args = {Msg:'ConveyorStartTransferring',WS:data.WS,From:data.FromZone, To:data.ToZone, PalletID:PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][5],ServiceID : data.ServiceID};
				RTU.emit('Event',args );
				args = {Msg:'ConveyorChangeState',WS:data.WS,State:'BUSY'};
				RTU.emit('Notification',args);
				switch(data.FromZone+data.ToZone)
				{	
					case'14':
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#cccccc");
						$("#WS"+data.WS+"_MC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_MC4").css("stroke","#cccccc");
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
						$("#WS"+data.WS+"_MC1").css("stroke","#00ff00");
						$("#WS"+data.WS+"_MC2").css("stroke","#cccccc");
						$("#WS"+data.WS+"_MC3").css("stroke","#ff0000");
						$("#WS"+data.WS+"_MC4").css("stroke","#cccccc");
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
						$("#WS"+data.WS+"_JC1").css("stroke","#cccccc");
						$("#WS"+data.WS+"_JC2").css("stroke","#cccccc");
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
						$("#WS"+data.WS+"_JC1").css("stroke","#cccccc");
						$("#WS"+data.WS+"_JC2").css("stroke","#cccccc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						ZonesPresence[parseInt(data.WS)-1][1] = 0;
						StopperIndication[parseInt(data.WS)-1][1] = 0;
						/* if(data.WS == '7')
						{
							ZonesPresence[parseInt(data.WS)-2][4] = 0;
						} */
						break;
					case'35':
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
						$("#WS"+data.WS+"_JC1").css("stroke","#cccccc");
						$("#WS"+data.WS+"_JC2").css("stroke","#cccccc");
						PalletState[parseInt(data.WS)-1][parseInt(data.FromZone)-1][0] = 1;
						ZonesPresence[parseInt(data.WS)-1][2] = 0;
						StopperIndication[parseInt(data.WS)-1][2] = 0;
						break;
				}
				Animate_Pallet(data);
			}
			
			function LoadPaper(Args)
			{
				args = {MSG:'RobotStartLoading',WS:'1',PalletID:Args.PalletID,ServiceID : Args.ServiceID};
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
				args = {MSG:'PaperLoaded',WS:'1',PalletID:Args.PalletID,ServiceID : Args.ServiceID};
					RTU.emit('Event',args );
					
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				
				},6000);
			}
			
			function UnloadPaper(Args)
			{
				WS_State[0][1]=1;
				args = {Msg:'RobotStartUnloading',WS:'1',PalletID:Args.PalletID,ServiceID : Args.ServiceID};
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
					args = {MSG:'PaperUnloaded',WS:'1',PalletID:Args.PalletID,ServiceID : Args.ServiceID};
					RTU.emit('Event',args );
					
				args = {MSG:'OpreationFinished',destURL:Args.destURL};
				RTU.emit('Event',args );
				
					args = {Msg:'RobotChangeState',WS:'1',State:'IDLE'};
					RTU.emit('Notification',args);
				},6000);
			}
			
			function Animate_Pallet(Args) 
			{
				document.getElementById('WS'+Args.WS+'_Zone'+String(Args.FromZone)+String(Args.ToZone)).beginElement();
				var TimeOutVal;
				if(Args.WS=='1'||Args.WS=='7'||Args.WS=='12'||Args.WS=='6')
				{
					switch(String(Args.FromZone)+String(Args.ToZone))
					{
						case '12':
							TimeOutVal = 0.8;
							break;
						case '23':
							TimeOutVal = 0.6;
							break;
						case '35':
							TimeOutVal = 1.66;
							break;
						case '14':
							TimeOutVal = 1.46;
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
						case '23':
							TimeOutVal = 0.6;
							break;
						case '35':
							TimeOutVal = 1.2;
							break;
						case '14':
							TimeOutVal = 1.46;
							break;
						case '45':
							TimeOutVal = 0.93;
							break;
					
					}
				}
				
				setTimeout(function(){ 
				// When Reach the final location
				
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
						$("#WS"+Args.WS+"_JC1").css("stroke","#cccccc");
						$("#WS"+Args.WS+"_JC2").css("stroke","#cccccc");
						$("#WS"+Args.WS+"_CC1").css("stroke","#ff0000");
						$("#WS"+Args.WS+"_CC2").css("stroke","#ff0000");
						
				switch(String(Args.FromZone)+String(Args.ToZone))
				{
					case'14':
						if(ZonesPresence[parseInt(Args.WS)-1][0] == 0){PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;}
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
						else
						{
							PalletState[parseInt(Args.WS)][0][0] = 1;
							ZonesPresence[parseInt(Args.WS)][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[parseInt(Args.WS)] = 1;
						}
						if(ZonesPresence[parseInt(Args.WS)-1][3] == 0){PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;}
						StopperIndication[parseInt(Args.WS)-1][3] = 1;
						break;
						
					case'12':
						if(ZonesPresence[parseInt(Args.WS)-1][0] == 0){PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;}
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][1] = 1;
						StopperIndication[parseInt(Args.WS)-1][0] = 1;
						break;
					case'23':
						if(ZonesPresence[parseInt(Args.WS)-1][1] == 0){PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;}
						PalletState[parseInt(Args.WS)-1][parseInt(Args.ToZone)-1][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][2] = 1;
						StopperIndication[parseInt(Args.WS)-1][1] = 1;
						break;
					case'35':
						if(Args.WS=='12')
						{
							PalletState[0][0][0] = 1;
							ZonesPresence[0][0] = 1;
							ZonesPresence[parseInt(Args.WS)-1][4] = 1;
							RFIDIndication[0] = 1;
						}
						else
						{
						PalletState[parseInt(Args.WS)][0][0] = 1;
						ZonesPresence[parseInt(Args.WS)][0] = 1;
						ZonesPresence[parseInt(Args.WS)-1][4] = 1;
						RFIDIndication[parseInt(Args.WS)] = 1;
						}
						if(ZonesPresence[parseInt(Args.WS)-1][2] == 0){PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][0] = 0;}
						StopperIndication[parseInt(Args.WS)-1][2] = 1;
						
						break;
				}
				for (var i = 1; i<7;i++ )
				{
					if (Args.WS=='12' && Args.ToZone == '5')
					{	
						PalletState[0][0][i]=PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][i];
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
				setTimeout(function(){
					args = {Msg:'ConveyorStopTransferring',WS:Args.WS,From:Args.FromZone, To:Args.ToZone, PalletID:PalletState[parseInt(Args.WS)-1][parseInt(Args.FromZone)-1][5],destURL:Args.destURL,ServiceID : Args.ServiceID};
					RTU.emit('Event',args );
					
					args = {MSG:'OpreationFinished',destURL:Args.destURL};
					RTU.emit('Event',args );
				
					args = {Msg:'ConveyorChangeState',WS:Args.WS,State:'IDLE',};
					RTU.emit('Notification',args);
				},200);
				
				
				//console.log(PalletState)
				}, (TimeOutVal-0.1)*1000);			
			}
			function Draw(Args)
			{
				WS_State[parseInt(Args.WS)-1][1]= 1;
				args = {MSG:'RobotStartDrawing',WS:Args.WS,PalletID:Args.PalletID,Recipe:Args.Recipe,ServiceID : Args.ServiceID};
				RTU.emit('Event',args );
				document.getElementById('WS'+Args.WS+'_Robot1').beginElement();
					setTimeout(function(){
						PalletState[parseInt(Args.WS)-1][2][parseInt(Args.OP)+1] = parseInt(Args.Color);
						if(document.getElementById('Maintenanc_checkBox').checked)
						{
							switch(Args.Color)
							{
								case 1:
									var RedLevel = document.getElementById('WS'+Args.WS+'_RedInk').getAttribute("height");
									var RedY = parseInt(document.getElementById('WS'+Args.WS+'_RedInk').getAttribute("y"))+1;
									if(RedLevel == 0)
									{
										Ink[parseInt(Args.WS)-1][parseInt(Args.Color)-1] = 0;
										document.getElementById('WS'+Args.WS+'_YellowAlarm').setAttribute("visibility","hidden");				
										document.getElementById('WS'+Args.WS+'_RedAlarm').setAttribute("visibility","visible");
										args = {MSG:'OutOfInk',WS:Args.WS,Color:'RED'};
										RTU.emit('Event',args);
									}
									else if(RedLevel > 0 && RedLevel <10 )
									{
										document.getElementById('WS'+Args.WS+'_RedInk').setAttribute("height",(RedLevel-1));
										document.getElementById('WS'+Args.WS+'_RedInk').setAttribute("y",RedY);
										document.getElementById('WS'+Args.WS+'_YellowAlarm').setAttribute("visibility","visible");
										args = {MSG:'LowInkLevel',WS:Args.WS,Color:'RED'};
										RTU.emit('Event',args);
									}
									else
									{
										document.getElementById('WS'+Args.WS+'_RedInk').setAttribute("height",(RedLevel-1));
										document.getElementById('WS'+Args.WS+'_RedInk').setAttribute("y",RedY);
									}
									break;
									
								case 2:
									var GreenLevel = document.getElementById('WS'+Args.WS+'_GreenInk').getAttribute("height");
									var GreenY = parseInt(document.getElementById('WS'+Args.WS+'_GreenInk').getAttribute("y"))+1;
									if(GreenLevel == 0)
									{
										Ink[parseInt(Args.WS)-1][parseInt(Args.Color)-1] = 0;
										document.getElementById('WS'+Args.WS+'_YellowAlarm').setAttribute("visibility","hidden");
										document.getElementById('WS'+Args.WS+'_RedAlarm').setAttribute("visibility","visible");
										args = {Msg:'OutOfInk',WS:Args.WS,Color:'GREEN'};
										RTU.emit('Event',args);
									}
									else if(GreenLevel > 0 && GreenLevel <10 )
									{
										document.getElementById('WS'+Args.WS+'_GreenInk').setAttribute("height",(GreenLevel-1));
										document.getElementById('WS'+Args.WS+'_GreenInk').setAttribute("y",GreenY);
										document.getElementById('WS'+Args.WS+'_YellowAlarm').setAttribute("visibility","visible");
										args = {Msg:'LowInkLevel',WS:Args.WS,Color:'GREEN'};
										RTU.emit('Event',args);
									}
									else
									{
										document.getElementById('WS'+Args.WS+'_GreenInk').setAttribute("height",(GreenLevel-1));
										document.getElementById('WS'+Args.WS+'_GreenInk').setAttribute("y",GreenY);
									}
									break;
								
								case 3:
									var BlueLevel = document.getElementById('WS'+Args.WS+'_BlueInk').getAttribute("height");
									var BlueY = parseInt(document.getElementById('WS'+Args.WS+'_BlueInk').getAttribute("y"))+1;
									if(BlueLevel == 0)
									{
										Ink[parseInt(Args.WS)-1][parseInt(Args.Color)-1] = 0;
										document.getElementById('WS'+Args.WS+'_YellowAlarm').setAttribute("visibility","hidden");
										document.getElementById('WS'+Args.WS+'_RedAlarm').setAttribute("visibility","visible");
										args = {Msg:'OutOfInk',WS:Args.WS,Color:'BLUE'};
										RTU.emit('Event',args);
									}
									else if(BlueLevel > 0 && BlueLevel <10 )
									{
										document.getElementById('WS'+Args.WS+'_BlueInk').setAttribute("height",(BlueLevel-1));
										document.getElementById('WS'+Args.WS+'_BlueInk').setAttribute("y",BlueY);
										document.getElementById('WS'+Args.WS+'_YellowAlarm').setAttribute("visibility","visible");
										args = {Msg:'LowInkLevel',WS:Args.WS,Color:'BLUE'};
										RTU.emit('Event',args);
									}
									else
									{
										document.getElementById('WS'+Args.WS+'_BlueInk').setAttribute("height",(BlueLevel-1));
										document.getElementById('WS'+Args.WS+'_BlueInk').setAttribute("y",BlueY);
									}
									break;
							}	
						}
					},2000);
					setTimeout(function(){
						WS_State[parseInt(Args.WS)-1][1]= 0;
						args = {MSG:'RobotStopDrawing',WS:Args.WS,PalletID:PalletState[parseInt(Args.WS)-1][2][5],Recipe:Args.Recipe,ServiceID : Args.ServiceID};
						RTU.emit('Event',args );
						args = {MSG:'OpreationFinished',destURL:Args.destURL};
						RTU.emit('Event',args );
					},4000);
					
			}
		
			
			$(document).ready(function(){
				$("#ResetAll").click(function(){
					var Args = {Link:HostName+"/RTU/reset"};
					socket.emit('Invoke',Args );
				});
			});
			