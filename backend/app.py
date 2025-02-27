from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None:
            self.root = TreeNode(value)
        else:
            self._insert(self.root, value)

    def _insert(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert(node.right, value)

    def to_dict(self, node):
        if node is None:
            return None
        return {
            'name': node.value,
            'children': [child for child in [self.to_dict(node.left), self.to_dict(node.right)] if child]
        }

bst = BST()

@app.route('/insert', methods=['POST'])
def insert():
    data = request.get_json()
    value = data.get("value")
    if value is not None:
        bst.insert(value)
        return jsonify({"tree": bst.to_dict(bst.root)})
    return jsonify({"error": "Invalid value"}), 400

@app.route('/tree', methods=['GET'])
def get_tree():
    return jsonify({"tree": bst.to_dict(bst.root)})

if __name__ == '__main__':
    app.run(debug=True)
