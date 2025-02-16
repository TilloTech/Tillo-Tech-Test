Imports System.IO
Imports System.Net.Http
Imports System.Threading.Tasks
Imports System.Data.SQLite

Public Class _Default
    Inherits System.Web.UI.Page

    Private dbPath As String = HttpContext.Current.Server.MapPath("~/App_Data/transactions.db")
    Private baseConnectionString As String = $"Data Source={dbPath};Version=3;"
    Private httpClient As New HttpClient()

    Private Class Transaction
        Public Property TransactionId As Integer
        Public Property TransactionDate As DateTime
        Public Property Amount As Decimal
        Public Property Description As String
        Public Property Type As String
        Public Property Status As String
        Public Property UserId As Integer
    End Class

    Private Class User
        Public Property UserId As Integer
        Public Property Balance As Decimal
    End Class


    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            CreateDatabaseIfNotExists()
            LoadTransactions()
        End If
    End Sub

    Protected Sub btnRefresh_Click(sender As Object, e As EventArgs)
        LoadTransactions()
    End Sub

    Protected Sub gvTransactions_PageIndexChanging(sender As Object, e As GridViewPageEventArgs)
        gvTransactions.PageIndex = e.NewPageIndex
        LoadTransactions()
    End Sub

    Private Async Sub LoadTransactions()
        Try
            Dim currentUser As User = GetCurrentUser()
            Dim transactions As List(Of Transaction) = Await GetTransactionsFromDatabase(currentUser.UserId)

            transactions = transactions.OrderByDescending(Function(t) t.TransactionDate).ToList()

            Dim balance As Decimal = currentUser.Balance  'Get user's balance

            lblBalance.Text = $"Current Balance: {balance:C2}"

            gvTransactions.DataSource = transactions
            gvTransactions.DataBind()

        Catch ex As Exception
            '
        End Try
    End Sub

    Private Sub CreateDatabaseIfNotExists()
        Dim directoryName As String = Path.GetDirectoryName(dbPath)
        If Not Directory.Exists(directoryName) Then
            Directory.CreateDirectory(directoryName)
        End If

        If Not File.Exists(dbPath) Then
            SQLiteConnection.CreateFile(dbPath)

            Using conn As New SQLiteConnection(baseConnectionString)
                conn.Open()

                ' Create Users table
                Dim cmdUsers As New SQLiteCommand(
                    "CREATE TABLE Users (" &
                    "UserId INTEGER PRIMARY KEY AUTOINCREMENT, " &
                    "Balance DECIMAL(18,2) NOT NULL DEFAULT 0.00)", conn)
                cmdUsers.ExecuteNonQuery()

                ' Create Transactions table (with foreign key to Users)
                Dim cmdTransactions As New SQLiteCommand(
                    "CREATE TABLE Transactions (" &
                    "TransactionId INTEGER PRIMARY KEY AUTOINCREMENT, " &
                    "Date DATETIME NOT NULL, " &
                    "Amount DECIMAL(18,2) NOT NULL, " &
                    "Description TEXT, " &
                    "Type TEXT CHECK(Type IN ('Transfer', 'TopUp', 'Withdraw')), " &
                    "Status TEXT, " &
                    "UserId INTEGER REFERENCES Users(UserId))", conn)
                cmdTransactions.ExecuteNonQuery()

                AddSampleData(conn)

            End Using
        End If
    End Sub

    Private Async Function GetTransactionsFromDatabase(userId As Integer) As Task(Of List(Of Transaction))
        Dim transactions As New List(Of Transaction)

        Using conn As New SQLiteConnection(baseConnectionString)
            Await conn.OpenAsync()

            Dim cmd As New SQLiteCommand("SELECT * FROM Transactions WHERE Date >= @startDate AND UserId = @userId", conn)
            cmd.Parameters.AddWithValue("@startDate", DateTime.Now.AddDays(-30).ToString("yyyy-MM-dd HH:mm:ss"))
            cmd.Parameters.AddWithValue("@userId", userId) ' Filter by user id

            Using reader As SQLiteDataReader = Await cmd.ExecuteReaderAsync()
                While Await reader.ReadAsync()
                    transactions.Add(New Transaction With {
                    .TransactionId = Convert.ToInt32(reader("TransactionId")),
                    .TransactionDate = Convert.ToDateTime(reader("Date")),
                    .Amount = Convert.ToDecimal(reader("Amount")),
                    .Description = reader("Description").ToString(),
                    .Type = reader("Type").ToString(),
                    .Status = reader("Status").ToString()
                })
                End While
            End Using
        End Using

        Return transactions
    End Function

    Public Sub AddSampleData(conn As SQLiteConnection)
        'Initial user's balance
        Dim cmdUserInsert As New SQLiteCommand("INSERT INTO Users (Balance) VALUES (1000.00)", conn)
        cmdUserInsert.ExecuteNonQuery()
        Dim userId As Long = conn.LastInsertRowId

        Dim transactions As New List(Of Transaction) From {
        New Transaction With {.TransactionDate = DateTime.Now.AddDays(-1), .Amount = 100D, .Description = "Sample Transaction 1", .Type = "TopUp", .Status = "Completed", .UserId = userId},
        New Transaction With {.TransactionDate = DateTime.Now.AddDays(-2), .Amount = 200D, .Description = "Sample Transaction 2", .Type = "Withdraw", .Status = "Completed", .UserId = userId},
        New Transaction With {.TransactionDate = DateTime.Now.AddDays(-3), .Amount = 300D, .Description = "Sample Transaction 3", .Type = "Transfer", .Status = "Completed", .UserId = userId}
    }

        For Each transaction In transactions
            Dim cmd As New SQLiteCommand("INSERT INTO Transactions (Date, Amount, Description, Type, Status, UserId) VALUES (@date, @amount, @description, @type, @status, @userId)", conn)
            cmd.Parameters.AddWithValue("@date", transaction.TransactionDate)
            cmd.Parameters.AddWithValue("@amount", transaction.Amount)
            cmd.Parameters.AddWithValue("@description", transaction.Description)
            cmd.Parameters.AddWithValue("@type", transaction.Type)
            cmd.Parameters.AddWithValue("@status", transaction.Status)
            cmd.Parameters.AddWithValue("@userId", transaction.UserId)
            cmd.ExecuteNonQuery()
        Next

        ' Update balance
        Dim updateCmd As New SQLiteCommand("UPDATE Users SET Balance = Balance + @balanceChange WHERE UserId = @userId", conn)
        updateCmd.Parameters.AddWithValue("@balanceChange", transactions.Sum(Function(t) If(t.Type = "TopUp", t.Amount, If(t.Type = "Withdraw" OrElse t.Type = "Transfer", -t.Amount, 0))))
        updateCmd.Parameters.AddWithValue("@userId", userId)
        updateCmd.ExecuteNonQuery()
    End Sub

    Private Function GetCurrentUser() As User
        ' For demonstration purposes, I've used a hardcoded user ID.
        Dim currentUserId As Integer = 1

        Using conn As New SQLiteConnection(baseConnectionString)
            conn.Open()
            Dim cmd As New SQLiteCommand("SELECT * FROM Users WHERE UserId = @UserId", conn)
            cmd.Parameters.AddWithValue("@UserId", currentUserId)
            Using reader As SQLiteDataReader = cmd.ExecuteReader()
                If reader.Read() Then
                    Return New User With {
                        .UserId = currentUserId,
                        .Balance = Convert.ToDecimal(reader("Balance"))
                    }
                End If
            End Using
        End Using

        Throw New Exception("Current user not found.")
    End Function

    Protected Sub btnSimulate_Click(sender As Object, e As EventArgs)
        Try
            Dim currentUser As User = GetCurrentUser()
            Dim random As New Random()
            Dim amount As Decimal = Math.Round(CDec(random.NextDouble() * 500), 2)
            Dim transactionType As String = GetRandomTransactionType(random)
            Dim description As String = "Simulated " & transactionType & " Transaction"

            Using conn As New SQLiteConnection(baseConnectionString)
                conn.Open()

                Dim cmd As New SQLiteCommand("INSERT INTO Transactions (Date, Amount, Description, Type, Status, UserId) VALUES (@date, @amount, @description, @type, @status, @userId)", conn)
                cmd.Parameters.AddWithValue("@date", DateTime.Now)
                cmd.Parameters.AddWithValue("@amount", amount)
                cmd.Parameters.AddWithValue("@description", description)
                cmd.Parameters.AddWithValue("@type", transactionType)
                cmd.Parameters.AddWithValue("@status", "Completed")
                cmd.Parameters.AddWithValue("@userId", currentUser.UserId)
                cmd.ExecuteNonQuery()

                ' Update User Balance - This is important
                UpdateBalance(conn, currentUser.UserId, amount, transactionType)

                'Show simulated transaction message
                Dim message As String = $"{transactionType}: {amount:C2} successful!"
                lblMessage.Text = message
                lblMessage.Visible = True

            End Using

            LoadTransactions()

        Catch ex As Exception
            ScriptManager.RegisterStartupScript(Me, Me.GetType(), "error", $"alert('Error simulating transaction: {ex.Message}');", True)
        End Try
    End Sub

    Private Function GetRandomTransactionType(random As Random) As String
        Dim types As String() = {"Transfer", "TopUp", "Withdraw"}
        Return types(random.Next(types.Length))
    End Function

    Private Sub UpdateBalance(conn As SQLiteConnection, userId As Integer, amount As Decimal, transactionType As String)
        Dim balanceChange As Decimal = amount
        'subtract in case of widthraw or transfered to other user
        If transactionType = "Withdraw" OrElse transactionType = "Transfer" Then
            balanceChange = -amount
        End If

        Dim currentBalance As Decimal = GetCurrentBalanceFromDatabase(conn, userId)

        Dim updateCmd As New SQLiteCommand("UPDATE Users SET Balance = @newBalance WHERE UserId = @userId", conn)
        Dim newBalance As Decimal = currentBalance + balanceChange
        updateCmd.Parameters.AddWithValue("@newBalance", newBalance)
        updateCmd.Parameters.AddWithValue("@userId", userId)
        updateCmd.ExecuteNonQuery()
    End Sub

    Private Function GetCurrentBalanceFromDatabase(conn As SQLiteConnection, userId As Integer) As Decimal
        Dim balance As Decimal = 0

        Dim selectCmd As New SQLiteCommand("SELECT Balance FROM Users WHERE UserId = @userId", conn)
        selectCmd.Parameters.AddWithValue("@userId", userId)

        Using reader As SQLiteDataReader = selectCmd.ExecuteReader()
            If reader.Read() Then
                balance = Convert.ToDecimal(reader("Balance"))
            End If
        End Using

        Return balance
    End Function

End Class