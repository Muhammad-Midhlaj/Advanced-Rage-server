using GTANetworkAPI;
using System.IO;

class Saved_Pos : Script
{
	[Command("save","Use /save [Position Name]", GreedyArg = true)]
        public void CMD_SavePosition(Client player, string PosName = "No Set")
        {
            var pos = (player.IsInVehicle) ? player.Vehicle.Position : player.Position;
            var rot = (player.IsInVehicle) ? player.Vehicle.Rotation : player.Rotation;
        
            using (var stream = File.AppendText("SavePos.txt"))
            {
                if (player.IsInVehicle)
                {
                    NAPI.Notification.SendNotificationToPlayer(player, "~g~In car ~w~postion saved with name ~r~" + PosName, true);
                    stream.WriteLine("IN VEH || " + PosName + ":" + pos.X + ", " + pos.Y + ", " + pos.Z + "    Rot:    " + rot.Z);
                    stream.Close();
                }
                else
                {
                    NAPI.Notification.SendNotificationToPlayer(player, "~g~On foot ~w~position saved with name ~r~" + PosName, true);
                    stream.WriteLine("ON FOOT|| " + PosName + ":" + pos.X + ", " + pos.Y + ", " + pos.Z + "    Rot:    " + rot.Z);
                    stream.Close();
                }
            }
        }
}