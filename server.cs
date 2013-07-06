// Node-dde
// (c) 2013 thunder9 (https://github.com/thunder9)
// Node-dde may be freely distributed under the MIT license.

using NDde.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NodeDde
{
    public class Server
    {
        public async Task<object> GetInvoker(IDictionary<string, object> input)
        {
            var service = (string)input["service"];
            var callbacks = (IDictionary<string, object>)input["callbacks"];
            var server = new MyServer(service, callbacks);

            return (Func<object, Task<object>>)(async (i) =>
            {
                var opts = (IDictionary<string, object>)i;
                var method = (string)opts["method"];
                var topic = opts.ContainsKey("topic") ? (string)opts["topic"] : null;
                var item = opts.ContainsKey("item") ? (string)opts["item"] : null;

                switch (method)
                {
                    case "Register":
                        server.Register();
                        break;
                    case "Unregister":
                        server.Unregister();
                        break;
                    case "Advise":
                        await Task.Run(() => server.Advise(topic, item));
                        break;
                    case "Disconnect":
                        server.Disconnect();
                        break;
                    case "Pause":
                        server.Pause();
                        break;
                    case "Resume":
                        server.Resume();
                        break;
                    case "Dispose":
                        server.Dispose();
                        break;
                    case "Service":
                        return server.Service;
                    case "IsRegistered":
                        return server.IsRegistered;
                }

                return null;
            });
        }

        private sealed class MyServer : DdeServer
        {
            private Func<object, Task<object>> _OnBeforeConnect = null;
            private Func<object, Task<object>> _OnAfterConnect = null;
            private Func<object, Task<object>> _OnDisconnect = null;
            private Func<object, Task<object>> _OnStartAdvise = null;
            private Func<object, Task<object>> _OnStopAdvise = null;
            private Func<object, Task<object>> _OnExecute = null;
            private Func<object, Task<object>> _OnPoke = null;
            private Func<object, Task<object>> _OnRequest = null;
            private Func<object, Task<object>> _OnAdvise = null;

            public MyServer(string service, IDictionary<string, object> callbacks)
                : base(service)
            {
                _OnBeforeConnect = (Func<object, Task<object>>)callbacks["OnBeforeConnect"];
                _OnAfterConnect = (Func<object, Task<object>>)callbacks["OnAfterConnect"];
                _OnDisconnect = (Func<object, Task<object>>)callbacks["OnDisconnect"];
                _OnStartAdvise = (Func<object, Task<object>>)callbacks["OnStartAdvise"];
                _OnStopAdvise = (Func<object, Task<object>>)callbacks["OnStopAdvise"];
                _OnExecute = (Func<object, Task<object>>)callbacks["OnExecute"];
                _OnPoke = (Func<object, Task<object>>)callbacks["OnPoke"];
                _OnRequest = (Func<object, Task<object>>)callbacks["OnRequest"];
                _OnAdvise = (Func<object, Task<object>>)callbacks["OnAdvise"];
            }

            protected override bool OnBeforeConnect(string topic)
            {
                var obj = new Dictionary<string, object>();
                obj["topic"] = topic;
                var tcs = new TaskCompletionSource<bool>();
                Task.Run(async () => {
                    var result = await _OnBeforeConnect(obj);
                    tcs.SetResult((bool)result);
                });
                return tcs.Task.Result;
            }

            protected override void OnAfterConnect(DdeConversation conversation)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                Task.Run(() => _OnAfterConnect(obj));
            }

            protected override void OnDisconnect(DdeConversation conversation)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                Task.Run(() => _OnDisconnect(obj));
            }

            protected override bool OnStartAdvise(DdeConversation conversation, string item, int format)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                obj["item"] = item;
                obj["format"] = format;
                var tcs = new TaskCompletionSource<bool>();
                Task.Run(async () =>
                {
                    var result = await _OnStartAdvise(obj);
                    tcs.SetResult((bool)result);
                });
                return tcs.Task.Result;
            }

            protected override void OnStopAdvise(DdeConversation conversation, string item)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                obj["item"] = item;
                Task.Run(() => _OnStopAdvise(obj));
            }

            protected override ExecuteResult OnExecute(DdeConversation conversation, string command)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                obj["command"] = command;
                var tcs = new TaskCompletionSource<string>();
                Task.Run(async () =>
                {
                    var result = await _OnExecute(obj);
                    tcs.SetResult((string)result);
                });

                switch (tcs.Task.Result)
                {
                    case "NotProcessed":
                        return ExecuteResult.NotProcessed;
                    case "PauseConversation":
                        return ExecuteResult.PauseConversation;
                    case "TooBusy":
                        return ExecuteResult.TooBusy;
                    default:
                        return ExecuteResult.Processed;
                }
            }

            protected override PokeResult OnPoke(DdeConversation conversation, string item, byte[] data, int format)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                obj["item"] = item;
                obj["data"] = Encoding.Default.GetString(data);
                obj["format"] = format;
                var tcs = new TaskCompletionSource<string>();
                Task.Run(async () =>
                {
                    var result = await _OnPoke(obj);
                    tcs.SetResult((string)result);
                });

                switch (tcs.Task.Result)
                {
                    case "NotProcessed":
                        return PokeResult.NotProcessed;
                    case "PauseConversation":
                        return PokeResult.PauseConversation;
                    case "TooBusy":
                        return PokeResult.TooBusy;
                    default:
                        return PokeResult.Processed;
                }
            }

            protected override RequestResult OnRequest(DdeConversation conversation, string item, int format)
            {
                var obj = new Dictionary<string, object>();
                obj["service"] = conversation.Service;
                obj["topic"] = conversation.Topic;
                obj["handle"] = conversation.Handle;
                obj["item"] = item;
                obj["format"] = format;
                var tcs = new TaskCompletionSource<string>();
                Task.Run(async () =>
                {
                    var result = await _OnRequest(obj);
                    tcs.SetResult((string)result);
                });

                var text = tcs.Task.Result;

                // Return data to the client only if the format is CF_TEXT.
                if (format == 1)
                {
                    return new RequestResult(System.Text.Encoding.Default.GetBytes(text + "\0"));
                }
                return RequestResult.NotProcessed;
            }

            protected override byte[] OnAdvise(string topic, string item, int format)
            {
                var obj = new Dictionary<string, object>();
                obj["topic"] = topic;
                obj["item"] = item;
                obj["format"] = format;
                var tcs = new TaskCompletionSource<string>();
                Task.Run(async () =>
                {
                    var result = await _OnAdvise(obj);
                    tcs.SetResult((string)result);
                });

                var text = tcs.Task.Result;

                // Send data to the client only if the format is CF_TEXT.
                if (format == 1)
                {
                    return System.Text.Encoding.Default.GetBytes(text + "\0");
                }
                return null;
            }

        }
    }
}