using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FintechTransactionSimulatorV2
{

    public partial class _Default : Page
    {

        private string dbPath = HttpContext.Current.Server.MapPath("~/App_Data/transactions.db");
        private string baseConnectionString;
        private HttpClient httpClient = new HttpClient();

        private class Transaction
        {
            public int TransactionId { get; set; }
            public DateTime TransactionDate { get; set; }
            public decimal Amount { get; set; }
            public string Description { get; set; }
            public string Type { get; set; }
            public string Status { get; set; }
            public int UserId { get; set; }
        }

        private class User
        {
            public int UserId { get; set; }
            public decimal Balance { get; set; }
        }

        public _Default()
        {
            baseConnectionString = $"Data Source={dbPath};Version=3;";
            Load += Page_Load;
        }


        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                CreateDatabaseIfNotExists();
                LoadTransactions();
            }
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            LoadTransactions();
        }

        protected void gvTransactions_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvTransactions.PageIndex = e.NewPageIndex;
            LoadTransactions();
        }

        private async void LoadTransactions()
        {
            try
            {
                var currentUser = GetCurrentUser();
                var transactions = await GetTransactionsFromDatabase(currentUser.UserId);

                transactions = transactions.OrderByDescending(t => t.TransactionDate).ToList();

                decimal balance = currentUser.Balance;  // Get user's balance

                lblBalance.Text = $"Current Balance: {balance:C2}";

                gvTransactions.DataSource = transactions;
                gvTransactions.DataBind();
            }

            catch (Exception ex)
            {
                // 
            }
        }

        private void CreateDatabaseIfNotExists()
        {
            string directoryName = Path.GetDirectoryName(dbPath);
            if (!Directory.Exists(directoryName))
            {
                Directory.CreateDirectory(directoryName);
            }

            if (!File.Exists(dbPath))
            {
                SQLiteConnection.CreateFile(dbPath);

                using (var conn = new SQLiteConnection(baseConnectionString))
                {
                    conn.Open();

                    // Create Users table
                    var cmdUsers = new SQLiteCommand("CREATE TABLE Users (" + "UserId INTEGER PRIMARY KEY AUTOINCREMENT, " + "Balance DECIMAL(18,2) NOT NULL DEFAULT 0.00)", conn);
                    cmdUsers.ExecuteNonQuery();

                    // Create Transactions table (with foreign key to Users)
                    var cmdTransactions = new SQLiteCommand("CREATE TABLE Transactions (" + "TransactionId INTEGER PRIMARY KEY AUTOINCREMENT, " + "Date DATETIME NOT NULL, " + "Amount DECIMAL(18,2) NOT NULL, " + "Description TEXT, " + "Type TEXT CHECK(Type IN ('Transfer', 'TopUp', 'Withdraw')), " + "Status TEXT, " + "UserId INTEGER REFERENCES Users(UserId))", conn);
                    cmdTransactions.ExecuteNonQuery();

                    AddSampleData(conn);

                }
            }
        }

        private async Task<List<Transaction>> GetTransactionsFromDatabase(int userId)
        {
            var transactions = new List<Transaction>();

            using (var conn = new SQLiteConnection(baseConnectionString))
            {
                await conn.OpenAsync();

                var cmd = new SQLiteCommand("SELECT * FROM Transactions WHERE Date >= @startDate AND UserId = @userId", conn);
                cmd.Parameters.AddWithValue("@startDate", DateTime.Now.AddDays(-30).ToString("yyyy-MM-dd HH:mm:ss"));
                cmd.Parameters.AddWithValue("@userId", userId); // Filter by user id

                using (SQLiteDataReader reader = (SQLiteDataReader)await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                        transactions.Add(new Transaction()
                        {
                            TransactionId = Convert.ToInt32(reader["TransactionId"]),
                            TransactionDate = Convert.ToDateTime(reader["Date"]),
                            Amount = Convert.ToDecimal(reader["Amount"]),
                            Description = reader["Description"].ToString(),
                            Type = reader["Type"].ToString(),
                            Status = reader["Status"].ToString()
                        });
                }
            }

            return transactions;
        }

        public void AddSampleData(SQLiteConnection conn)
        {
            // Initial user's balance
            var cmdUserInsert = new SQLiteCommand("INSERT INTO Users (Balance) VALUES (1000.00)", conn);
            cmdUserInsert.ExecuteNonQuery();
            long userId = conn.LastInsertRowId;

            var transactions = new List<Transaction>() { new Transaction() { TransactionDate = DateTime.Now.AddDays(-1), Amount = 100m, Description = "Sample Transaction 1", Type = "TopUp", Status = "Completed", UserId = (int)userId }, new Transaction() { TransactionDate = DateTime.Now.AddDays(-2), Amount = 200m, Description = "Sample Transaction 2", Type = "Withdraw", Status = "Completed", UserId = (int)userId }, new Transaction() { TransactionDate = DateTime.Now.AddDays(-3), Amount = 300m, Description = "Sample Transaction 3", Type = "Transfer", Status = "Completed", UserId = (int)userId } };

            foreach (var transaction in transactions)
            {
                var cmd = new SQLiteCommand("INSERT INTO Transactions (Date, Amount, Description, Type, Status, UserId) VALUES (@date, @amount, @description, @type, @status, @userId)", conn);
                cmd.Parameters.AddWithValue("@date", transaction.TransactionDate);
                cmd.Parameters.AddWithValue("@amount", transaction.Amount);
                cmd.Parameters.AddWithValue("@description", transaction.Description);
                cmd.Parameters.AddWithValue("@type", transaction.Type);
                cmd.Parameters.AddWithValue("@status", transaction.Status);
                cmd.Parameters.AddWithValue("@userId", transaction.UserId);
                cmd.ExecuteNonQuery();
            }

            // Update balance
            var updateCmd = new SQLiteCommand("UPDATE Users SET Balance = Balance + @balanceChange WHERE UserId = @userId", conn);
            updateCmd.Parameters.AddWithValue("@balanceChange", transactions.Sum(t => t.Type == "TopUp" ? t.Amount : t.Type == "Withdraw" || t.Type == "Transfer" ? -t.Amount : 0m));
            updateCmd.Parameters.AddWithValue("@userId", userId);
            updateCmd.ExecuteNonQuery();
        }

        private User GetCurrentUser()
        {
            // For demonstration purposes, I've used a hardcoded user ID.
            int currentUserId = 1;

            using (var conn = new SQLiteConnection(baseConnectionString))
            {
                conn.Open();
                var cmd = new SQLiteCommand("SELECT * FROM Users WHERE UserId = @UserId", conn);
                cmd.Parameters.AddWithValue("@UserId", currentUserId);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new User()
                        {
                            UserId = currentUserId,
                            Balance = Convert.ToDecimal(reader["Balance"])
                        };
                    }
                }
            }

            throw new Exception("Current user not found.");
        }

        protected void btnSimulate_Click(object sender, EventArgs e)
        {
            try
            {
                var currentUser = GetCurrentUser();
                var random = new Random();
                decimal amount = Math.Round((decimal)(random.NextDouble() * 500d), 2);
                string transactionType = GetRandomTransactionType(random);
                string description = "Simulated " + transactionType + " Transaction";

                using (var conn = new SQLiteConnection(baseConnectionString))
                {
                    conn.Open();

                    var cmd = new SQLiteCommand("INSERT INTO Transactions (Date, Amount, Description, Type, Status, UserId) VALUES (@date, @amount, @description, @type, @status, @userId)", conn);
                    cmd.Parameters.AddWithValue("@date", DateTime.Now);
                    cmd.Parameters.AddWithValue("@amount", amount);
                    cmd.Parameters.AddWithValue("@description", description);
                    cmd.Parameters.AddWithValue("@type", transactionType);
                    cmd.Parameters.AddWithValue("@status", "Completed");
                    cmd.Parameters.AddWithValue("@userId", currentUser.UserId);
                    cmd.ExecuteNonQuery();

                    // Update User Balance - This is important
                    UpdateBalance(conn, currentUser.UserId, amount, transactionType);

                    // Show simulated transaction message
                    string message = $"{transactionType}: {amount:C2} successful!";
                    lblMessage.Text = message;
                    lblMessage.Visible = true;

                }

                LoadTransactions();
            }

            catch (Exception ex)
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "error", $"alert('Error simulating transaction: {ex.Message}');", true);
            }
        }

        private string GetRandomTransactionType(Random random)
        {
            string[] types = new[] { "Transfer", "TopUp", "Withdraw" };
            return types[random.Next(types.Length)];
        }

        private void UpdateBalance(SQLiteConnection conn, int userId, decimal amount, string transactionType)
        {
            decimal balanceChange = amount;
            // subtract in case of widthraw or transfered to other user
            if (transactionType == "Withdraw" || transactionType == "Transfer")
            {
                balanceChange = -amount;
            }

            decimal currentBalance = GetCurrentBalanceFromDatabase(conn, userId);

            var updateCmd = new SQLiteCommand("UPDATE Users SET Balance = @newBalance WHERE UserId = @userId", conn);
            decimal newBalance = currentBalance + balanceChange;
            updateCmd.Parameters.AddWithValue("@newBalance", newBalance);
            updateCmd.Parameters.AddWithValue("@userId", userId);
            updateCmd.ExecuteNonQuery();
        }

        private decimal GetCurrentBalanceFromDatabase(SQLiteConnection conn, int userId)
        {
            decimal balance = 0m;

            var selectCmd = new SQLiteCommand("SELECT Balance FROM Users WHERE UserId = @userId", conn);
            selectCmd.Parameters.AddWithValue("@userId", userId);

            using (var reader = selectCmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    balance = Convert.ToDecimal(reader["Balance"]);
                }
            }

            return balance;
        }

    }
}