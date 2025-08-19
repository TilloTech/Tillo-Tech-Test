<%@ Page Language="cs" AutoEventWireup="false" CodeBehind="Default.aspx.cs" Inherits="FintechTransactionSimulatorV2._Default" Async="true" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title>Financial Transaction Simulator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        .grid-container {
            margin: 20px;
            padding: 20px;
        }

        .button-group {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .balance-container {
            text-align: right;
            margin-bottom: 20px;
        }

        .message-container {
            margin-top: 10px;
        }
    </style>
</head>

<body>
    <form id="form1" runat="server">
        <div class="container">
            <h2 class="mt-4 mb-4">Financial Transaction Simulator</h2>

            <div class="d-flex justify-content-between align-items-center">
                <div class="button-group">
                    <asp:Button ID="btnRefresh" runat="server" Text="Refresh" CssClass="btn btn-primary" OnClick="btnRefresh_Click" />
                    <asp:Button ID="btnSimulate" runat="server" Text="Simulate Transaction" CssClass="btn btn-success ms-2" OnClick="btnSimulate_Click" />
                </div>
                <div class="balance-container">
                    <asp:Label ID="lblBalance" runat="server" CssClass="h4"></asp:Label>
                </div>
            </div>

            <div class="message-container">
                <asp:Label ID="lblMessage" runat="server" CssClass="h7"></asp:Label>
            </div>

            <div class="grid-container">
                <asp:GridView ID="gvTransactions" runat="server"
                    CssClass="table table-striped table-bordered table-hover" AutoGenerateColumns="False"
                    AllowPaging="True" PageSize="10" OnPageIndexChanging="gvTransactions_PageIndexChanging">
                    <Columns>
                        <asp:BoundField DataField="TransactionId" HeaderText="ID" />
                        <asp:BoundField DataField="TransactionDate" HeaderText="Date"
                            DataFormatString="{0:MM/dd/yyyy HH:mm}" />
                        <asp:BoundField DataField="Amount" HeaderText="Amount" DataFormatString="{0:C2}" />
                        <asp:BoundField DataField="Description" HeaderText="Description" />
                        <asp:BoundField DataField="Type" HeaderText="Type" />
                        <asp:BoundField DataField="Status" HeaderText="Status" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
